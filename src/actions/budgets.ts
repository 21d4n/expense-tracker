"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export type BudgetActionState = {
  success?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: {
    month?: string[];
    amount?: string[];
  };
  values?: {
    month?: string;
    amount?: string;
  };
};

const MonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const BudgetSchema = z.object({
  month: z
    .string()
    .trim()
    .regex(
      MonthRegex,
      "Format bulan tidak valid. Gunakan format YYYY-MM (contoh: 2026-09)."
    )
    .refine((val) => {
      const [yearStr] = val.split("-");
      const year = parseInt(yearStr, 10);
      return year >= 1900 && year <= 2100;
    }, "Tahun harus berada dalam rentang 1900 hingga 2100."),
  amount: z
    .string()
    .trim()
    .min(1, "Nominal budget wajib diisi.")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, "Nominal budget harus berupa angka positif lebih besar dari 0.")
    .refine((val) => {
      const parts = val.split(".");
      return parts.length === 1 || parts[1].length <= 2;
    }, "Nominal budget maksimal memiliki 2 angka desimal.")
    .refine((val) => {
      const num = Number(val);
      return num <= 999999999999.99;
    }, "Nominal budget melebihi batas maksimum (Decimal 14,2)."),
});

/**
 * Mendapatkan string bulan berjalan (YYYY-MM) berdasarkan zona waktu Asia/Jakarta.
 */
export async function getCurrentMonthWIB(): Promise<string> {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  });
  return formatter.format(now);
}

/**
 * Menghitung rentang tanggal UTC untuk satu bulan WIB (Asia/Jakarta).
 */
export function getWIBMonthDateRange(year: number, month: number): {
  startDate: Date;
  endDate: Date;
} {
  // Awal bulan WIB: YYYY-MM-01 00:00:00+07:00 -> UTC = jam - 7
  const startDate = new Date(Date.UTC(year, month - 1, 1, -7, 0, 0, 0));

  // Awal bulan berikutnya WIB
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = new Date(Date.UTC(nextYear, nextMonth - 1, 1, -7, 0, 0, 0));

  return { startDate, endDate };
}

/**
 * Server Action untuk membuat atau memperbarui budget (FR-13, FR-17).
 * Identitas pengguna dijamin selalu dari session server-side (SEC-03).
 */
export async function setBudgetAction(
  _prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  const verified = await verifySession();
  if (!verified) {
    return {
      error: "Sesi tidak valid atau telah kedaluwarsa. Silakan masuk kembali.",
    };
  }

  const rawData = {
    month: formData.get("month")?.toString() ?? "",
    amount: formData.get("amount")?.toString().trim() ?? "",
  };

  const validation = BudgetSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      error: "Mohon periksa data anggaran yang Anda masukkan.",
      fieldErrors: {
        month: fieldErrors.month,
        amount: fieldErrors.amount,
      },
      values: {
        month: rawData.month,
        amount: rawData.amount,
      },
    };
  }

  const { month: validatedMonth, amount: validatedAmount } = validation.data;
  const [yearStr, monthStr] = validatedMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const userId = verified.user.id;

  try {
    await prisma.budget.upsert({
      where: {
        userId_year_month: {
          userId,
          year,
          month,
        },
      },
      create: {
        userId,
        year,
        month,
        amount: validatedAmount,
      },
      update: {
        amount: validatedAmount,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/budgets");

    return {
      success: true,
      message: `Anggaran untuk periode ${validatedMonth} berhasil disimpan.`,
      values: {
        month: validatedMonth,
        amount: validatedAmount,
      },
    };
  } catch (error) {
    console.error("Kesalahan saat menyimpan anggaran:", error);
    return {
      error: "Terjadi kesalahan pada server saat menyimpan anggaran. Silakan coba lagi.",
      values: {
        month: rawData.month,
        amount: rawData.amount,
      },
    };
  }
}
