import Link from "next/link";
import DeleteTransactionButton from "@/components/transactions/delete-transaction-button";
import { formatRupiah, formatTanggal } from "./format";

export type DashboardTransaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  occurredAt: string;
};

export default function TransactionList({ items }: { items: DashboardTransaction[] }) {
  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-lg font-semibold text-text-primary">Belum ada transaksi untuk filter ini.</p>
        <p className="mt-2 text-sm text-text-secondary">Catat pemasukan atau pengeluaran untuk memulai.</p>
        <Link href="/dashboard/transactions/new" className="button button-primary mt-6">
          Tambah transaksi
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {items.map((tx) => (
        <li key={tx.id} className="card flex flex-wrap items-center gap-3 p-4 sm:p-5">
          <div className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
            <p className="break-words text-base font-semibold text-text-primary">{tx.description}</p>
            <p className="mt-1 text-sm text-text-secondary">{formatTanggal(tx.occurredAt)}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
              tx.type === "INCOME" ? "border-success/50 text-success" : "border-danger/50 text-danger"
            }`}
          >
            {tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
          </span>
          <strong className={`ml-auto break-words text-right text-base tabular-nums ${tx.type === "INCOME" ? "text-success" : "text-danger"}`}>
            {tx.type === "INCOME" ? "+" : "-"}
            {formatRupiah(tx.amount)}
          </strong>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <Link href={`/dashboard/transactions/${tx.id}/edit`} className="button button-secondary flex-1 sm:flex-none">
              Ubah
            </Link>
            <DeleteTransactionButton id={tx.id} description={tx.description} />
          </div>
        </li>
      ))}
    </ul>
  );
}
