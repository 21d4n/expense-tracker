import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentMonthWIB, getWIBMonthDateRange } from "@/actions/budgets";
import { LogoutButton } from "@/components/auth/logout-button";
import { BudgetMonthSelector } from "@/components/budgets/budget-month-selector";
import { BudgetStatusCard } from "@/components/budgets/budget-status-card";
import { BudgetForm } from "@/components/budgets/budget-form";

export const metadata = {
  title: "Atur Anggaran — Expense Tracker",
  description: "Kelola batas pengeluaran bulanan Anda.",
};

const MonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BudgetsPage({ searchParams }: PageProps) {
  const { user } = await requireAuth();

  const resolvedParams = await searchParams;
  const rawMonth = typeof resolvedParams.month === "string" ? resolvedParams.month : undefined;

  let selectedMonth: string;
  if (rawMonth && MonthRegex.test(rawMonth)) {
    selectedMonth = rawMonth;
  } else {
    selectedMonth = await getCurrentMonthWIB();
  }

  const [yearStr, monthStr] = selectedMonth.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  // Ambil budget milik user pada tahun & bulan terpilih (FR-17)
  const budget = await prisma.budget.findUnique({
    where: {
      userId_year_month: {
        userId: user.id,
        year,
        month: monthNum,
      },
    },
  });

  // Hitung total pengeluaran EXPENSE milik user pada bulan WIB terpilih (FR-14, SRS 3)
  const { startDate, endDate } = getWIBMonthDateRange(year, monthNum);
  const expenseAggregate = await prisma.transaction.aggregate({
    where: {
      userId: user.id,
      type: "EXPENSE",
      occurredAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalExpense = expenseAggregate._sum.amount
    ? Number(expenseAggregate._sum.amount)
    : 0;

  const budgetAmount = budget ? Number(budget.amount) : null;

  return (
    <main className="min-h-screen bg-background text-text-primary pb-16">
      {/* Top Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-bold tracking-tight text-text-primary hover:text-primary transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold text-xs">
                ET
              </div>
              <span className="hidden sm:inline">Expense Tracker</span>
            </Link>
            <span className="text-text-secondary/50 hidden sm:inline">/</span>
            <span className="text-sm font-medium text-text-secondary">
              Anggaran Bulanan
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary hidden sm:inline">
              Halo, <strong className="text-text-primary font-medium">{user.name}</strong>
            </span>
            <Link
              href="/dashboard"
              className="button button-secondary text-xs sm:text-sm font-medium"
            >
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 space-y-6">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            Kelola Anggaran Bulanan
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Pilih periode bulan dan tetapkan batas pengeluaran untuk mengontrol keuangan pribadi Anda.
          </p>
        </div>

        {/* Month Selector Component */}
        <BudgetMonthSelector currentMonth={selectedMonth} />

        {/* Current Budget Summary & Status Card */}
        <BudgetStatusCard
          month={selectedMonth}
          budgetAmount={budgetAmount}
          totalExpense={totalExpense}
        />

        {/* Set / Update Budget Form */}
        <BudgetForm
          month={selectedMonth}
          initialAmount={budget ? budget.amount.toString() : ""}
        />
      </div>
    </main>
  );
}
