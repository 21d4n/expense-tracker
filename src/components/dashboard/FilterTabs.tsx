"use client";

import Link, { useLinkStatus } from "next/link";

export type DashboardFilter = "all" | "INCOME" | "EXPENSE";

const TABS: { value: DashboardFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "INCOME", label: "Pemasukan" },
  { value: "EXPENSE", label: "Pengeluaran" },
];

function FilterPending() {
  const { pending } = useLinkStatus();
  return pending ? <span role="status" className="ml-1 text-xs">Memuat…</span> : null;
}

export default function FilterTabs({ active, month }: { active: DashboardFilter; month: string }) {
  return (
    <nav aria-label="Filter transaksi" className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.value}
            href={`/dashboard?${new URLSearchParams({ type: tab.value, month })}`}
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "button button-primary" : "button button-secondary"}
          >
            {tab.label}
            <FilterPending />
          </Link>
        );
      })}
    </nav>
  );
}
