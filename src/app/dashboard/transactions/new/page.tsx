import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import TransactionForm from "@/components/transactions/transaction-form";

export const metadata = {
  title: "Tambah Transaksi — Expense Tracker",
  description: "Catat pemasukan atau pengeluaran baru.",
};

export default async function NewTransactionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Catat transaksi</p>
      <h1 className="mt-2 text-3xl font-bold text-text-primary">Tambah transaksi</h1>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Catat pemasukan atau pengeluaran baru. Semua nominal dalam Rupiah.
      </p>

      <div className="card card-accent mt-6 p-6 sm:p-8">
        <TransactionForm mode="create" />
      </div>

      <Link href="/dashboard" className="button button-ghost mt-6 min-h-[40px]">
        &larr; Kembali ke dashboard
      </Link>
    </main>
  );
}
