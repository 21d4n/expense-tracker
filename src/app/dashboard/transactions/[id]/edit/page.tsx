import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import TransactionForm from "@/components/transactions/transaction-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Edit Transaksi — Expense Tracker",
  description: "Perbarui catatan transaksi milikmu.",
};

type EditTransactionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  // Owner filter: transaksi milik user lain dianggap tidak ada (BR-03).
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  });
  if (!transaction) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Ubah transaksi</p>
      <h1 className="mt-2 text-3xl font-bold text-text-primary">Edit transaksi</h1>
      <p className="mt-2 text-sm leading-6 text-text-secondary">Perbarui catatan transaksi milikmu.</p>

      <div className="card card-accent mt-6 p-6 sm:p-8">
        <TransactionForm
          mode="edit"
          id={transaction.id}
          defaultType={transaction.type}
          defaultAmount={transaction.amount.toString()}
          defaultDescription={transaction.description}
          defaultOccurredAt={transaction.occurredAt.toISOString().slice(0, 10)}
        />
      </div>

      <Link href="/dashboard" className="button button-ghost mt-6 min-h-[40px]">
        &larr; Kembali ke dashboard
      </Link>
    </main>
  );
}
