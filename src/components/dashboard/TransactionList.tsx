import Link from "next/link";
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
        <p className="eyebrow">BELUM ADA CATATAN</p>
        <p className="mt-3 text-lg text-parchment">Riwayat transaksi masih kosong.</p>
        <p className="mt-1 text-sm text-muted">Mulai petualangan finansialmu dengan catatan pertama.</p>
        {/* Route milik Programmer 3; P2 hanya menyediakan link. */}
        <Link href="/dashboard/transactions/new" className="button button-primary mt-6">
          Tambah transaksi
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {items.map((tx) => (
        <li key={tx.id} className="card flex flex-wrap items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold text-parchment">{tx.description}</p>
            <p className="mt-1 text-sm text-muted">{formatTanggal(tx.occurredAt)}</p>
          </div>
          <span
            className={`inline-flex items-center rounded border px-2 py-1 font-display text-xs tracking-widest ${
              tx.type === "INCOME" ? "border-success/50 text-success" : "border-danger/50 text-danger"
            }`}
          >
            {tx.type === "INCOME" ? "MASUK" : "KELUAR"}
          </span>
          <strong className={`min-w-28 text-right text-base ${tx.type === "INCOME" ? "text-success" : "text-danger"}`}>
            {tx.type === "INCOME" ? "+" : "-"}
            {formatRupiah(tx.amount)}
          </strong>
          <div className="flex w-full gap-2 sm:w-auto">
            {/* Route milik Programmer 3; P2 hanya menyediakan link baca. */}
            <Link href={`/dashboard/transactions/${tx.id}/edit`} className="button button-secondary flex-1 sm:flex-none">
              Ubah
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
