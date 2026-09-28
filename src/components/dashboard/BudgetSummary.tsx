import Link from "next/link";

export type BudgetStatus = "safe" | "warning" | "exceeded";

type BudgetSummaryProps = {
  month: string;
  amount: string | null;
  expense: string;
  remaining: string | null;
  usagePercent: string | null;
  status: BudgetStatus | null;
  progressPercent: number | null;
};

const statusAppearance: Record<BudgetStatus, { label: string; text: string; bar: string }> = {
  safe: { label: "Aman", text: "text-success", bar: "bg-success" },
  warning: { label: "Mendekati Batas", text: "text-warning", bar: "bg-warning" },
  exceeded: { label: "Melebihi Anggaran", text: "text-danger", bar: "bg-danger" },
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

export default function BudgetSummary({ month, amount, expense, remaining, usagePercent, status, progressPercent }: BudgetSummaryProps) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(0);
  firstDay.setUTCFullYear(year, monthNumber - 1, 1);
  const period = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    firstDay,
  );
  const budgetHref = `/dashboard/budgets?${new URLSearchParams({ month })}`;

  if (amount === null) {
    return (
      <section aria-label={`Ringkasan budget ${period}`} className="card grid gap-4 p-6">
        <h2 className="text-xl font-semibold text-text-primary">Budget {period}</h2>
        <p className="text-sm text-text-secondary">Belum ada budget untuk bulan ini. Tetapkan batas pengeluaran agar penggunaannya dapat dipantau.</p>
        <p className="text-sm text-text-secondary">
          Pengeluaran bulan terpilih: <strong className="text-lg text-danger tabular-nums">{formatBudgetRupiah(expense)}</strong>
        </p>
        <Link href={budgetHref} className="button button-primary w-fit">Set Budget</Link>
      </section>
    );
  }

  const appearance = status === null ? null : statusAppearance[status];

  return (
    <section aria-label={`Ringkasan budget ${period}`} className="card grid gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-text-primary">Budget {period}</h2>
        <Link href={budgetHref} className="button button-secondary">Atur budget</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-text-secondary">Budget bulanan</p>
          <p className="break-words text-xl font-semibold tabular-nums">{formatBudgetRupiah(amount)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Pengeluaran bulan terpilih</p>
          <p className="break-words text-xl font-semibold tabular-nums">{formatBudgetRupiah(expense)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Sisa budget</p>
          <p className="break-words text-xl font-semibold tabular-nums">
            {remaining === null ? "Belum tersedia" : formatBudgetRupiah(remaining)}
          </p>
        </div>
      </div>
      {usagePercent !== null && progressPercent !== null && appearance !== null && (
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>Penggunaan budget</span>
            <strong className={`tabular-nums ${appearance.text}`}>
              {appearance.label} — {formatPercent(usagePercent)}
            </strong>
          </div>
          <div
            role="progressbar"
            aria-label={`Penggunaan budget ${period}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-valuetext={`${appearance.label}, ${formatPercent(usagePercent)} digunakan`}
            className="h-3 overflow-hidden rounded-full bg-surface-elevated"
          >
            <div className={`h-full rounded-full ${appearance.bar}`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}
      {status === "exceeded" && (
        <p role="alert" className="rounded-lg border border-danger bg-danger/10 p-4 text-sm text-danger">
          Budget bulan ini terlampaui. Sisa budget {remaining === null ? "belum tersedia" : formatBudgetRupiah(remaining)}.
        </p>
      )}
    </section>
  );
}
