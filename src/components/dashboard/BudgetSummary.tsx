type BudgetSummaryProps = {
  month: string;
  amount: string | null;
  expense: string;
  remaining: string | null;
  usagePercent: string | null;
};

function formatBudgetRupiah(value: string): string {
  const negative = value.startsWith("-");
  const [whole, fraction] = (negative ? value.slice(1) : value).split(".");
  const grouped = new Intl.NumberFormat("id-ID").format(BigInt(whole));
  return `${negative ? "-" : ""}Rp${grouped}${fraction === "00" ? "" : `,${fraction}`}`;
}

function formatPercent(value: string): string {
  const [whole, fraction] = value.split(".");
  return `${new Intl.NumberFormat("id-ID").format(BigInt(whole))},${fraction}%`;
}

export default function BudgetSummary({ month, amount, expense, remaining, usagePercent }: BudgetSummaryProps) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(0);
  firstDay.setUTCFullYear(year, monthNumber - 1, 1);
  const period = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    firstDay,
  );

  return (
    <section aria-label={`Ringkasan budget ${period}`} className="card grid gap-4 p-6">
      <h2 className="text-xl font-semibold">Budget {period}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Budget bulanan</p>
          <p className="text-xl font-semibold tabular-nums">{amount === null ? "Belum ditetapkan" : formatBudgetRupiah(amount)}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Pengeluaran bulan terpilih</p>
          <p className="text-xl font-semibold tabular-nums">{formatBudgetRupiah(expense)}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Sisa budget</p>
          <p className="text-xl font-semibold tabular-nums">
            {remaining === null ? "Belum tersedia" : formatBudgetRupiah(remaining)}
          </p>
        </div>
      </div>
      {usagePercent !== null && (
        <p className="text-sm tabular-nums">Penggunaan: {formatPercent(usagePercent)}</p>
      )}
    </section>
  );
}
