"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* Session — ADAPTER SEMENTARA milik Programmer 3 (FR-05/06/07)         */
/* TODO(prog-1): ganti getTransactionUser() dengan helper resmi dari    */
/* src/lib/auth.ts setelah branch feature/auth-session merge. Kontrak   */
/* yang diharapkan: baca cookie session HttpOnly -> kembalikan user     */
/* yang login, atau null bila tidak ada/kadaluarsa. Nama cookie di      */
/* bawah HARUS disamakan dengan implementasi Programmer 1.              */
/* ------------------------------------------------------------------ */

const SESSION_COOKIE_NAME = "session";
const TRANSACTION_FILTER_COOKIE_NAME = "txn_filter";

export type TransactionUser = {
  id: string;
  name: string;
};

export async function getTransactionUser(): Promise<TransactionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, name: true } } },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

/* ------------------------------------------------------------------ */
/* Tipe state & filter (type-only export, aman untuk "use server")      */
/* ------------------------------------------------------------------ */

export type TransactionField = "type" | "amount" | "description" | "occurredAt";
export type TransactionFieldErrors = Partial<Record<TransactionField, string[]>>;

export type TransactionFormState = {
  ok: boolean;
  message: string;
  fieldErrors: TransactionFieldErrors;
};

export type TransactionFilter = "all" | "INCOME" | "EXPENSE";

/* ------------------------------------------------------------------ */
/* Validasi Zod — server-side (SRS: nominal > 0, deskripsi wajib,       */
/* tipe hanya INCOME/EXPENSE). Pesan aman berbahasa Indonesia.          */
/* ------------------------------------------------------------------ */

const AMOUNT_PATTERN = /^\d{1,12}(\.\d{1,2})?$/;

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], { error: "Tipe transaksi tidak valid." }),
  amount: z
    .string({ error: "Nominal wajib diisi." })
    .trim()
    .regex(AMOUNT_PATTERN, { error: "Nominal harus angka positif, maksimal 2 desimal." })
    .refine((value) => Number(value) > 0, { error: "Nominal harus lebih besar dari 0." }),
  description: z
    .string({ error: "Deskripsi wajib diisi." })
    .trim()
    .min(1, { error: "Deskripsi wajib diisi." })
    .max(500, { error: "Deskripsi maksimal 500 karakter." }),
  occurredAt: z
    .string({ error: "Tanggal transaksi wajib diisi." })
    .trim()
    .min(1, { error: "Tanggal transaksi wajib diisi." })
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      error: "Tanggal transaksi tidak valid.",
    }),
});

function toFieldErrors(error: z.ZodError): TransactionFieldErrors {
  const fieldErrors: TransactionFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key === "type" || key === "amount" || key === "description" || key === "occurredAt") {
      const list = fieldErrors[key] ?? [];
      list.push(issue.message);
      fieldErrors[key] = list;
    }
  }
  return fieldErrors;
}

function unauthorizedState(): TransactionFormState {
  return { ok: false, message: "Sesi berakhir. Silakan masuk kembali.", fieldErrors: {} };
}

/* ------------------------------------------------------------------ */
/* CRUD terotorisasi — semua query dibatasi userId dari session         */
/* tepercaya (BR-01, BR-03). Tidak pernah menerima userId dari client.  */
/* ------------------------------------------------------------------ */

export async function createTransaction(
  _prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const user = await getTransactionUser();
  if (!user) return unauthorizedState();

  const parsed = transactionSchema.safeParse({
    type: String(formData.get("type") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    description: String(formData.get("description") ?? ""),
    occurredAt: String(formData.get("occurredAt") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: "Periksa kembali isian formulir.", fieldErrors: toFieldErrors(parsed.error) };
  }

  try {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: parsed.data.type,
        amount: parsed.data.amount,
        description: parsed.data.description,
        occurredAt: new Date(parsed.data.occurredAt),
      },
    });
  } catch {
    console.error("createTransaction failed");
    return { ok: false, message: "Transaksi gagal disimpan. Coba lagi.", fieldErrors: {} };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateTransaction(
  id: string,
  _prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const user = await getTransactionUser();
  if (!user) return unauthorizedState();

  const parsed = transactionSchema.safeParse({
    type: String(formData.get("type") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    description: String(formData.get("description") ?? ""),
    occurredAt: String(formData.get("occurredAt") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: "Periksa kembali isian formulir.", fieldErrors: toFieldErrors(parsed.error) };
  }

  try {
    // Owner filter: ID milik user lain dianggap tidak ditemukan (pesan aman).
    const existing = await prisma.transaction.findFirst({ where: { id, userId: user.id } });
    if (!existing) {
      return { ok: false, message: "Transaksi tidak ditemukan.", fieldErrors: {} };
    }
    await prisma.transaction.update({
      where: { id: existing.id },
      data: {
        type: parsed.data.type,
        amount: parsed.data.amount,
        description: parsed.data.description,
        occurredAt: new Date(parsed.data.occurredAt),
      },
    });
  } catch {
    console.error("updateTransaction failed");
    return { ok: false, message: "Transaksi gagal diubah. Coba lagi.", fieldErrors: {} };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteTransaction(id: string): Promise<{ ok: boolean; message: string }> {
  const user = await getTransactionUser();
  if (!user) return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };

  try {
    const deleted = await prisma.transaction.deleteMany({ where: { id, userId: user.id } });
    if (deleted.count === 0) {
      return { ok: false, message: "Transaksi tidak ditemukan." };
    }
  } catch {
    console.error("deleteTransaction failed");
    return { ok: false, message: "Transaksi gagal dihapus. Coba lagi." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/* ------------------------------------------------------------------ */
/* Preferensi filter (FR-07, SRS Preference): cookie BIASA non-sensitif */
/* — hanya menyimpan pilihan tampilan, TIDAK PERNAH dipakai untuk       */
/* authorization/identitas. Default: "all".                             */
/* ------------------------------------------------------------------ */

export async function setTransactionFilterPreference(value: string): Promise<TransactionFilter> {
  const next: TransactionFilter =
    value === "INCOME" || value === "EXPENSE" || value === "all" ? value : "all";
  const cookieStore = await cookies();
  cookieStore.set(TRANSACTION_FILTER_COOKIE_NAME, next, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return next;
}
