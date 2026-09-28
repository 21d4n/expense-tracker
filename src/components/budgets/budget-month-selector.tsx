"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface BudgetMonthSelectorProps {
  currentMonth: string; // format: "YYYY-MM"
}

export function BudgetMonthSelector({ currentMonth }: BudgetMonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleMonthChange = (newMonth: string) => {
    if (!newMonth || newMonth === currentMonth) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", newMonth);
      router.push(`/dashboard/budgets?${params.toString()}`);
    });
  };

  const handleOffsetMonth = (offset: number) => {
    const [yearStr, monthStr] = currentMonth.split("-");
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + offset;

    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }

    const formatted = `${year}-${String(month).padStart(2, "0")}`;
    handleMonthChange(formatted);
  };

  // Nama bulan bahasa Indonesia
  const [yearStr, monthStr] = currentMonth.split("-");
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const formattedMonthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(dateObj);

  return (
    <div className="card p-4 sm:p-5 bg-surface border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <label
          htmlFor="month-picker"
          className="text-xs font-semibold uppercase tracking-wider text-text-secondary block"
        >
          Pilih Periode Anggaran
        </label>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-text-primary capitalize">
            {formattedMonthName}
          </span>
          {isPending && (
            <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Memuat...
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => handleOffsetMonth(-1)}
          disabled={isPending}
          title="Bulan sebelumnya"
          aria-label="Bulan sebelumnya"
          className="button button-secondary p-2.5 text-text-secondary hover:text-text-primary h-10 w-10 disabled:opacity-50"
        >
          ◀
        </button>

        <input
          id="month-picker"
          type="month"
          value={currentMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          disabled={isPending}
          className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-10 flex-1 sm:w-44 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={() => handleOffsetMonth(1)}
          disabled={isPending}
          title="Bulan berikutnya"
          aria-label="Bulan berikutnya"
          className="button button-secondary p-2.5 text-text-secondary hover:text-text-primary h-10 w-10 disabled:opacity-50"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
