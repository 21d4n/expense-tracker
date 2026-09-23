import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "session_token";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

/**
 * Hashing token untuk disimpan di database (SHA-256).
 * Browser hanya menyimpan raw token yang tidak dapat ditebak.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Enkripsi password menggunakan bcryptjs (SEC-01).
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifikasi password terhadap hash yang tersimpan.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Membuat session baru di database dan menyimpan cookie session HttpOnly (FR-03, SEC-02).
 */
export async function createSession(userId: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });

  return rawToken;
}

/**
 * Membaca raw session token dari cookie.
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Memverifikasi session aktif dari cookie dan database.
 * Jika session kadaluarsa atau tidak valid, session dibersihkan (BR-04).
 */
export async function verifySession() {
  const rawToken = await getSessionToken();
  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);

  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Periksa masa berlaku (BR-04)
    if (session.expiresAt <= new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      try {
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE_NAME);
      } catch {
        // Abaikan error pada Server Component rendering di mana cookieStore bersifat read-only
      }
      return null;
    }

    return {
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
      user: session.user,
    };
  } catch (error) {
    console.error("Gagal memverifikasi session:", error);
    return null;
  }
}

/**
 * Mengambil data user yang sedang login, atau null jika anonim.
 */
export async function getCurrentUser() {
  const verified = await verifySession();
  return verified?.user ?? null;
}

/**
 * Menghapus session dari database dan membersihkan cookie session (FR-08).
 */
export async function deleteSession(): Promise<void> {
  const rawToken = await getSessionToken();

  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    try {
      await prisma.session.deleteMany({
        where: { tokenHash },
      });
    } catch (error) {
      console.error("Gagal menghapus session dari database:", error);
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Guard untuk halaman / server actions yang memerlukan autentikasi.
 * Mengarahkan pengguna anonim ke halaman /login.
 */
export async function requireAuth() {
  const verified = await verifySession();
  if (!verified) {
    redirect("/login");
  }
  return verified;
}

/**
 * Guard untuk halaman guest (/login, /register).
 * Mengarahkan pengguna yang sudah login ke /dashboard.
 */
export async function requireGuest() {
  const verified = await verifySession();
  if (verified) {
    redirect("/dashboard");
  }
}
