"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { setBudgetAction, type BudgetActionState } from "@/actions/budgets";

interface BudgetFormProps {
  month: string;
  initialAmount?: string;
}

const initialState: BudgetActionState = {};

export function BudgetForm({ month, initialAmount = "" }: BudgetFormProps) {
  const [state, formAction, isPending] = useActionState(
    setBudgetAction,
    initialState
  );

  const [amountValue, setAmountValue] = useState(initialAmount);

  // Perbarui input amount jika bulan berubah di parent
  useEffect(() => {
    setAmountValue(initialAmount);
  }, [month, initialAmount]);

  const [yearStr, monthStr] = month.split("-");
  const monthDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const formattedMonthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(monthDate);

  const isEditing = Boolean(initialAmount && Number(initialAmount) > 0);

  return (
    <div className="card p-6 sm:p-8 border-border bg-surface space-y-6">
      <div className="border-b border-border pb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Formulir Pengaturan
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
          {isEditing ? "Perbarui Anggaran" : "Tetapkan Anggaran Baru"}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Tentukan batas nominal pengeluaran untuk periode{" "}
          <strong className="text-text-primary capitalize">{formattedMonthName}</strong>.
        </p>
      </div>

      {/* Success Alert */}
      {state.success && state.message && (
        <div
          role="status"
          className="rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-success flex items-start gap-3"
        >
          <svg
            className="h-5 w-5 shrink-0 text-success mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="leading-snug">{state.message}</span>
        </div>
      )}

      {/* Error Alert */}
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger flex items-start gap-3"
        >
          <svg
            className="h-5 w-5 shrink-0 text-danger mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="leading-snug">{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {/* Hidden Input Bulan (FR-17: terikat pada bulan pilihan) */}
        <input type="hidden" name="month" value={month} />

        <div>
          <label
            htmlFor="amount"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Nominal Anggaran (Rp)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-secondary">
              Rp
            </span>
            <input
              id="amount"
              name="amount"
              type="number"
              step="any"
              min="0.01"
              required
              disabled={isPending}
              value={amountValue}
              onChange={(e) => setAmountValue(e.target.value)}
              placeholder="Contoh: 3000000"
              className={`w-full rounded-lg border bg-surface-elevated pl-11 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] tabular-nums disabled:opacity-50 ${
                state.fieldErrors?.amount
                  ? "border-danger ring-1 ring-danger"
                  : "border-border"
              }`}
            />
          </div>
          {state.fieldErrors?.amount && (
            <p className="mt-1.5 text-xs text-danger">
              {state.fieldErrors.amount[0]}
            </p>
          )}
          <p className="mt-1.5 text-xs text-text-secondary">
            Maksimal 2 angka di belakang koma. Anggaran hanya memperhitungkan transaksi pengeluaran (EXPENSE) pada bulan ini.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/dashboard"
            className="button button-secondary w-full sm:w-auto text-sm"
          >
            Kembali ke Dashboard
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="button button-primary w-full sm:w-auto text-sm font-semibold min-h-[42px]"
          >
            {isPending
              ? "Menyimpan..."
              : isEditing
              ? "Perbarui Anggaran"
              : "Simpan Anggaran"}
          </button>
        </div>
      </form>
    </div>
  );
}
