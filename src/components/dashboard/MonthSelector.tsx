"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { DashboardFilter } from "./FilterTabs";

export default function MonthSelector({ month, type }: { month: string; type: DashboardFilter }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="dashboard-month" className="text-sm font-medium">
        Bulan budget
      </label>
      <input
        id="dashboard-month"
        type="month"
        min="0001-01"
        max="9999-12"
        value={month}
        disabled={isPending}
        onChange={(event) => {
          const selectedMonth = event.target.value;
          if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(selectedMonth) || selectedMonth.startsWith("0000")) return;
          startTransition(() => {
            router.push(`/dashboard?${new URLSearchParams({ type, month: selectedMonth })}`);
          });
        }}
        className="min-h-10 rounded-lg border border-line bg-surface px-3 text-sm text-parchment focus-visible:outline-2 focus-visible:outline-offset-2"
      />
      <span role="status" aria-live="polite" className="text-sm text-muted">
        {isPending ? "Memuat bulan…" : ""}
      </span>
    </div>
  );
}
