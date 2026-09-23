"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
} from "@/lib/auth";

export type AuthActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  values?: {
    name?: string;
    email?: string;
  };
};

const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama wajib diisi.")
      .max(100, "Nama maksimal 100 karakter."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email wajib diisi.")
      .email("Format email tidak valid."),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(100, "Password maksimal 100 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

/**
 * Server Action untuk registrasi pengguna baru (FR-01).
 * Menggunakan Zod untuk validasi, bcryptjs untuk hash password,
 * dan otomatis membuat session server-side serta cookie HttpOnly (FR-03).
 */
export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
  };

  const validation = RegisterSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      error: "Mohon periksa data yang Anda masukkan.",
      fieldErrors: {
        name: fieldErrors.name,
        email: fieldErrors.email,
        password: fieldErrors.password,
        confirmPassword: fieldErrors.confirmPassword,
      },
      values: {
        name: rawData.name,
        email: rawData.email,
      },
    };
  }

  const { name, email, password } = validation.data;
  let userIdToLogin: string | null = null;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk.",
        fieldErrors: {
          email: ["Email sudah terdaftar."],
        },
        values: { name, email },
      };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    await createSession(newUser.id);
    userIdToLogin = newUser.id;
  } catch (error) {
    console.error("Kesalahan saat registrasi:", error);
    return {
      error: "Terjadi kesalahan pada server saat memproses pendaftaran. Silakan coba lagi.",
      values: { name, email },
    };
  }

  if (userIdToLogin) {
    redirect("/dashboard");
  }

  return {};
}

/**
 * Server Action untuk login pengguna (FR-02).
 * Memeriksa email & password dengan aman (SEC-04),
 * lalu membuat session server-side dan cookie HttpOnly (FR-03, SEC-02).
 */
export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const validation = LoginSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      error: "Mohon periksa email dan password Anda.",
      fieldErrors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
      values: {
        email: rawData.email,
      },
    };
  }

  const { email, password } = validation.data;
  let shouldRedirect = false;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        error: "Email atau password salah.",
        values: { email },
      };
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        error: "Email atau password salah.",
        values: { email },
      };
    }

    await createSession(user.id);
    shouldRedirect = true;
  } catch (error) {
    console.error("Kesalahan saat login:", error);
    return {
      error: "Terjadi kesalahan pada server saat memproses login. Silakan coba lagi.",
      values: { email },
    };
  }

  if (shouldRedirect) {
    redirect("/dashboard");
  }

  return {};
}

/**
 * Server Action untuk logout pengguna (FR-08).
 * Menghapus session dari database dan membersihkan cookie session.
 */
export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
