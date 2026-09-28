import { formatRupiah } from "./format";

type SummaryCardsProps = {
  balance: string;
  totalIncome: string;
  totalExpense: string;
};

export default function SummaryCards({ balance, totalIncome, totalExpense }: SummaryCardsProps) {
  return (
    <section aria-label="Ringkasan keuangan keseluruhan" className="grid gap-4 md:grid-cols-3">
      <div className="card card-accent p-6">
        <p className="text-sm font-medium text-text-secondary">Saldo keseluruhan</p>
        <p className="mt-2 break-words text-2xl font-bold tabular-nums text-text-primary">{formatRupiah(balance)}</p>
        <p className="mt-2 text-sm text-text-secondary">Total pemasukan dikurangi pengeluaran.</p>
      </div>
      <div className="card p-6">
        <p className="text-sm font-medium text-text-secondary">Total pemasukan</p>
        <p className="mt-2 break-words text-2xl font-bold tabular-nums text-success">{formatRupiah(totalIncome)}</p>
        <p className="mt-2 text-sm text-text-secondary">Dari seluruh transaksi milikmu.</p>
      </div>
      <div className="card p-6">
        <p className="text-sm font-medium text-text-secondary">Total pengeluaran</p>
        <p className="mt-2 break-words text-2xl font-bold tabular-nums text-danger">{formatRupiah(totalExpense)}</p>
        <p className="mt-2 text-sm text-text-secondary">Dari seluruh transaksi milikmu.</p>
      </div>
    </section>
  );
}
