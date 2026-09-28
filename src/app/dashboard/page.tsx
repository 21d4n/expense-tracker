import Link from "next/link";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getCurrentMonthWIB } from "@/lib/budget-month";
import SummaryCards from "@/components/dashboard/SummaryCards";
import FilterTabs, { type DashboardFilter } from "@/components/dashboard/FilterTabs";
import MonthSelector from "@/components/dashboard/MonthSelector";
import BudgetSummary, { type BudgetStatus } from "@/components/dashboard/BudgetSummary";
import TransactionList, { type DashboardTransaction } from "@/components/dashboard/TransactionList";
import { LogoutButton } from "@/components/auth/logout-button";

const filterSchema = z.enum(["all", "INCOME", "EXPENSE"]);
const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).refine((value) => value.slice(0, 4) !== "0000");

function parseFilter(raw: string | string[] | undefined): DashboardFilter {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = filterSchema.safeParse(value);
  return parsed.success ? parsed.data : "all";
}

function parseMonth(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = monthSchema.safeParse(value);
  return parsed.success ? parsed.data : getCurrentMonthWIB();
}

function jakartaMonthBounds(value: string): { start: Date; end: Date; year: number; monthNumber: number } {
  const [year, monthNumber] = value.split("-").map(Number);
  // Midnight WIB is 17:00 UTC on the previous day. setUTCFullYear handles years 1–99 correctly.
  const start = new Date(0);
  start.setUTCFullYear(year, monthNumber - 1, 1);
  start.setUTCHours(-7, 0, 0, 0);
  const end = new Date(0);
  end.setUTCFullYear(year, monthNumber, 1);
  end.setUTCHours(-7, 0, 0, 0);
  return { start, end, year, monthNumber };
}

type DashboardPageProps = {
  searchParams: Promise<{ type?: string | string[]; month?: string | string[] }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Guard session kanonis P1 (cookie session_token + cek expiry, BR-04).
  // Anon otomatis redirect ke /login, konsisten dengan middleware.
  const { user } = await requireAuth();

  const resolvedParams = await searchParams;
  const filter = parseFilter(resolvedParams.type);
  const month = parseMonth(resolvedParams.month);
  const { start, end, year, monthNumber } = jakartaMonthBounds(month);

  // Ringkasan selalu global per user (BR-02); filter hanya memengaruhi riwayat.
  const [incomeAgg, expenseAgg, rows, budget, monthlyExpenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId: user.id, type: "INCOME" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId: user.id, type: "EXPENSE" },
    }),
    prisma.transaction.findMany({
      where: filter === "all" ? { userId: user.id } : { userId: user.id, type: filter },
      orderBy: { occurredAt: "desc" },
      take: 30,
      select: { id: true, type: true, amount: true, description: true, occurredAt: true },
    }),
    prisma.budget.findUnique({
      where: { userId_year_month: { userId: user.id, year, month: monthNumber } },
      select: { amount: true },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId: user.id,
        type: "EXPENSE",
        occurredAt: { gte: start, lt: end },
      },
    }),
  ]);

  const totalIncome = incomeAgg._sum.amount ?? new Prisma.Decimal(0);
  const totalExpense = expenseAgg._sum.amount ?? new Prisma.Decimal(0);
  const balance = totalIncome.minus(totalExpense);
  const monthlyExpense = monthlyExpenseAgg._sum.amount ?? new Prisma.Decimal(0);
  const budgetAmount = budget?.amount ?? null;
  const remaining = budgetAmount?.minus(monthlyExpense) ?? null;
  const usagePercent = budgetAmount ? monthlyExpense.div(budgetAmount).times(100) : null;
  // Bandingkan nilai Decimal asli; pembulatan dua desimal hanya untuk teks UI.
  const budgetStatus: BudgetStatus | null = usagePercent === null
    ? null
    : usagePercent.gt(100)
      ? "exceeded"
      : usagePercent.gte(80)
        ? "warning"
        : "safe";
  const progressPercent = usagePercent === null ? null : usagePercent.gt(100) ? 100 : usagePercent.toNumber();

  const items: DashboardTransaction[] = rows.map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount.toFixed(2),
    description: tx.description,
    occurredAt: tx.occurredAt.toISOString(),
  }));

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-sm font-medium text-primary">Expense Tracker</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Halo, {user.name}</h1>
          <p className="mt-1 text-sm text-text-secondary">Pantau keuangan dan budget bulananmu.</p>
        </div>
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Link href="/dashboard/transactions/new" className="button button-primary">
            Tambah transaksi
          </Link>
          <LogoutButton className="button button-ghost" />
        </div>
      </header>

      <SummaryCards
        balance={balance.toFixed(2)}
        totalIncome={totalIncome.toFixed(2)}
        totalExpense={totalExpense.toFixed(2)}
      />

      <MonthSelector month={month} type={filter} />
      <BudgetSummary
        month={month}
        amount={budgetAmount?.toFixed(2) ?? null}
        expense={monthlyExpense.toFixed(2)}
        remaining={remaining?.toFixed(2) ?? null}
        usagePercent={usagePercent?.toFixed(2) ?? null}
        status={budgetStatus}
        progressPercent={progressPercent}
      />

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-text-primary">Riwayat transaksi</h2>
          <FilterTabs active={filter} month={month} />
        </div>
        <TransactionList items={items} />
      </section>
    </main>
  );
}
