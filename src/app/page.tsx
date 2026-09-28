import Link from "next/link";

const features = [
  {
    title: "Pencatatan Cepat & Tepat",
    description:
      "Catat setiap pemasukan dan pengeluaran secara terstruktur dengan riwayat transaksi yang rapi dan mudah difilter.",
  },
  {
    title: "Anggaran Bulanan Terukur",
    description:
      "Tetapkan limit pengeluaran per bulan, pantau sisa saldo, dan terima peringatan dini saat pengeluaran mendekati atau melampaui batas.",
  },
  {
    title: "Privasi & Keamanan Maksimal",
    description:
      "Seluruh data transaksi dan budget sepenuhnya privat. Akses dilindungi sesi terenkripsi server-side tanpa celah akses antar-pengguna.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      {/* Header / Navbar */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-20">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-text-primary hover:text-primary transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold text-sm">
              ET
            </div>
            <span>Expense Tracker</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="button button-ghost text-sm font-medium hover:text-text-primary transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="button button-primary text-sm font-semibold"
            >
              Daftar Gratis
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Sistem Keuangan Modern & Privat
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.15]">
              Kelola keuangan pribadi dengan{" "}
              <span className="text-primary">kejelasan penuh.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-text-secondary max-w-xl">
              Pantau arus kas, tetapkan anggaran bulanan terarah, dan hindari pengeluaran tak terduga dengan platform pelacak finansial yang cepat, modern, dan aman.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="button button-primary button-lg font-semibold shadow-lg shadow-primary/20"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/login"
                className="button button-secondary button-lg font-medium"
              >
                Masuk ke Dashboard
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 border-t border-border pt-6 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Akses Sesi Privat</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Anggaran Bulanan Dinamis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Tanpa Full Page Reload</span>
              </div>
            </div>
          </div>

          {/* Interactive FinTech Preview Card */}
          <div className="card p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">
                  Saldo Bersih Keseluruhan
                </p>
                <p className="mt-1 text-3xl font-bold text-text-primary tabular-nums">
                  Rp 8.450.000
                </p>
              </div>
              <span className="inline-flex items-center rounded-md bg-success/10 border border-success/20 px-2.5 py-1 text-xs font-medium text-success">
                Aktif
              </span>
            </div>

            {/* Income & Expense Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-box">
                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Total Pemasukan
                </span>
                <strong className="text-success text-base sm:text-lg">
                  Rp 12.000.000
                </strong>
              </div>
              <div className="stat-box">
                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-danger" />
                  Total Pengeluaran
                </span>
                <strong className="text-danger text-base sm:text-lg">
                  Rp 3.550.000
                </strong>
              </div>
            </div>

            {/* Monthly Budget Preview Widget */}
            <div className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-secondary">
                  Anggaran Bulan Berjalan
                </span>
                <span className="font-semibold text-success bg-success/15 px-2 py-0.5 rounded text-[11px]">
                  Aman (71%)
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: "71%" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-secondary tabular-nums">
                  <span>Terpakai: Rp 3.550.000</span>
                  <span>Batas: Rp 5.000.000</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-text-secondary text-center">
                Daftar sekarang untuk mulai mengontrol alur pengeluaran Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-surface/40 py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Fokus pada Pengambilan Keputusan Finansial
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              Semua fitur dirancang khusus untuk kenyamanan dan kejelasan Anda tanpa gangguan ornamen yang berlebihan.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated border border-border text-primary font-bold text-sm mb-4">
                  ✓
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-text-secondary">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Expense Tracker. Hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-text-primary transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-text-primary transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
