import Link from "next/link";

export type DashboardFilter = "all" | "INCOME" | "EXPENSE";

const TABS: { value: DashboardFilter; label: string; href: string }[] = [
  { value: "all", label: "Semua", href: "/dashboard" },
  { value: "INCOME", label: "Pemasukan", href: "/dashboard?type=INCOME" },
  { value: "EXPENSE", label: "Pengeluaran", href: "/dashboard?type=EXPENSE" },
];

export default function FilterTabs({ active }: { active: DashboardFilter }) {
  return (
    <nav aria-label="Filter transaksi" className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "button button-primary" : "button button-secondary"}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
