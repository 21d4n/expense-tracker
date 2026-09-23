import { formatRupiah } from "./format";

type SummaryCardsProps = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
};

export default function SummaryCards({ balance, totalIncome, totalExpense }: SummaryCardsProps) {
  return (
    <section aria-label="Ringkasan keuangan" className="grid gap-4 sm:grid-cols-3">
      <div className="card card-accent p-6">
        <p className="eyebrow">SALDO SAAT INI</p>
        <p className="mt-2 font-display text-3xl font-bold text-parchment">{formatRupiah(balance)}</p>
        <p className="mt-2 text-sm text-muted">Pemasukan dikurangi pengeluaran.</p>
      </div>
      <div className="card p-6">
        <p className="eyebrow">PEMASUKAN</p>
        <p className="mt-2 font-display text-3xl font-bold text-success">{formatRupiah(totalIncome)}</p>
        <p className="mt-2 text-sm text-muted">Total dana masuk milikmu.</p>
      </div>
      <div className="card p-6">
        <p className="eyebrow">PENGELUARAN</p>
        <p className="mt-2 font-display text-3xl font-bold text-danger">{formatRupiah(totalExpense)}</p>
        <p className="mt-2 text-sm text-muted">Total dana keluar milikmu.</p>
      </div>
    </section>
  );
}
