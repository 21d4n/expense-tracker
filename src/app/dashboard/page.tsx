import Link from "next/link";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import SummaryCards from "@/components/dashboard/SummaryCards";
import FilterTabs, { type DashboardFilter } from "@/components/dashboard/FilterTabs";
import TransactionList, { type DashboardTransaction } from "@/components/dashboard/TransactionList";
import { LogoutButton } from "@/components/auth/logout-button";

const filterSchema = z.enum(["all", "INCOME", "EXPENSE"]);

function parseFilter(raw: string | string[] | undefined): DashboardFilter {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = filterSchema.safeParse(value);
  return parsed.success ? parsed.data : "all";
}

type DashboardPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Guard session kanonis P1 (cookie session_token + cek expiry, BR-04).
  // Anon otomatis redirect ke /login, konsisten dengan middleware.
  const { user } = await requireAuth();

  const resolvedParams = await searchParams;
  const filter = parseFilter(resolvedParams.type);

  // Ringkasan selalu global per user (BR-02); filter hanya memengaruhi riwayat.
  const [incomeAgg, expenseAgg, rows] = await Promise.all([
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
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpense = Number(expenseAgg._sum.amount ?? 0);
  const balance = totalIncome - totalExpense;

  const items: DashboardTransaction[] = rows.map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: Number(tx.amount),
    description: tx.description,
    occurredAt: tx.occurredAt.toISOString(),
  }));

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">PAPAN PETUALANGAN</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-parchment">Halo, {user.name}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Route tambah milik Programmer 3; aksi logout milik Programmer 1. */}
          <Link href="/dashboard/transactions/new" className="button button-primary">
            Tambah transaksi
          </Link>
          <LogoutButton className="button button-ghost" />
        </div>
      </header>

      <SummaryCards balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-parchment">Riwayat transaksi</h2>
          <FilterTabs active={filter} />
        </div>
        <TransactionList items={items} />
      </section>
    </main>
  );
}
