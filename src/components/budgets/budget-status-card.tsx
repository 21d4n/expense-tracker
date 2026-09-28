interface BudgetStatusCardProps {
  month: string;
  budgetAmount: number | null;
  totalExpense: number;
}

function formatRupiah(value: number): string {
  const isNegative = value < 0;
  const absFormatted = new Intl.NumberFormat("id-ID").format(Math.abs(value));
  return isNegative ? `-Rp ${absFormatted}` : `Rp ${absFormatted}`;
}

export function BudgetStatusCard({
  month,
  budgetAmount,
  totalExpense,
}: BudgetStatusCardProps) {
  // Parsing label bulan untuk judul ramah pengguna
  const [yearStr, monthStr] = month.split("-");
  const monthDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(monthDate);

  // Jika belum ada budget untuk bulan ini (Empty State)
  if (budgetAmount === null) {
    return (
      <div className="card p-6 sm:p-8 border-border bg-surface space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Status Anggaran — {monthName}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
              Belum Ada Anggaran
            </h2>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-surface-elevated border border-border px-3 py-1 text-xs font-medium text-text-secondary">
            Belum Ditetapkan
          </span>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-surface-elevated/40 p-6 text-center space-y-3">
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Anda belum menetapkan batas pengeluaran untuk periode{" "}
            <strong className="text-text-primary capitalize">{monthName}</strong>. Tetapkan nominal anggaran pada formulir di bawah agar pengeluaran dapat terpantau.
          </p>

          <div className="pt-2">
            <span className="text-xs text-text-secondary block">
              Pengeluaran tercatat sejauh ini:
            </span>
            <span className="text-lg font-bold text-danger tabular-nums">
              {formatRupiah(totalExpense)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Jika budget sudah ditetapkan
  const remaining = budgetAmount - totalExpense;
  const usagePercent = (totalExpense / budgetAmount) * 100;
  const formattedPercent = (Math.round(usagePercent * 100) / 100).toFixed(2);

  let statusText = "Aman";
  let statusBadgeClass = "bg-success/15 border-success/30 text-success";
  let progressBarClass = "bg-success";

  if (usagePercent > 100) {
    statusText = "Melebihi Anggaran";
    statusBadgeClass = "bg-danger/15 border-danger/30 text-danger";
    progressBarClass = "bg-danger";
  } else if (usagePercent >= 80) {
    statusText = "Mendekati Batas";
    statusBadgeClass = "bg-warning/15 border-warning/30 text-warning";
    progressBarClass = "bg-warning";
  }

  const isExceeded = usagePercent > 100;

  return (
    <div className="card p-6 sm:p-8 border-border bg-surface space-y-6">
      {/* Header Kartu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Pemantauan Anggaran — {monthName}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
            Ringkasan Penggunaan
          </h2>
        </div>
        <span
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {statusText} ({formattedPercent}%)
        </span>
      </div>

      {/* Alert banner jika melebihi anggaran (FR-15) */}
      {isExceeded && (
        <div
          role="alert"
          className="rounded-xl border border-danger/50 bg-danger/10 p-4 text-sm text-danger flex items-start gap-3"
        >
          <svg
            className="h-5 w-5 shrink-0 text-danger mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="space-y-1">
            <strong className="font-semibold block">
              Peringatan: Anggaran Terlampaui!
            </strong>
            <p className="text-xs sm:text-sm text-danger/90 leading-relaxed">
              Total pengeluaran Anda telah melampaui limit anggaran sebesar{" "}
              <strong className="underline tabular-nums">
                {formatRupiah(Math.abs(remaining))}
              </strong>
              . Harap perhatikan kembali transaksi pengeluaran bulan ini.
            </p>
          </div>
        </div>
      )}

      {/* Grid Statistik 3 Kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="stat-box">
          <span className="text-text-secondary font-medium">Batas Anggaran</span>
          <strong className="text-text-primary text-lg">
            {formatRupiah(budgetAmount)}
          </strong>
        </div>

        <div className="stat-box">
          <span className="text-text-secondary font-medium">
            Total Pengeluaran
          </span>
          <strong className="text-danger text-lg">
            {formatRupiah(totalExpense)}
          </strong>
        </div>

        <div className="stat-box">
          <span className="text-text-secondary font-medium">Sisa Anggaran</span>
          <strong
            className={`text-lg ${
              remaining < 0 ? "text-danger" : "text-success"
            }`}
          >
            {formatRupiah(remaining)}
          </strong>
        </div>
      </div>

      {/* Progress Bar Indikator Pemakaian */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-text-secondary">
            Tingkat Penggunaan
          </span>
          <span className="font-semibold text-text-primary tabular-nums">
            {formattedPercent}% dari total anggaran
          </span>
        </div>

        <div className="h-2.5 w-full rounded-full bg-surface-elevated overflow-hidden border border-border">
          <div
            className={`h-full rounded-full transition-all duration-300 ${progressBarClass}`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-text-secondary/70">
          <span>0%</span>
          <span>80% (Mendekati)</span>
          <span>100% (Batas Maksimal)</span>
        </div>
      </div>
    </div>
  );
}
