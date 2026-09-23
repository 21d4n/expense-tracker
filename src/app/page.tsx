import Link from "next/link";

const features = [
  ["Saldo terkendali", "Lihat kondisi keuanganmu dari satu dashboard."],
  ["Catatan teratur", "Simpan setiap pemasukan dan pengeluaran dengan rapi."],
  ["Data milikmu", "Akunmu hanya dapat mengakses transaksi milik sendiri."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="font-display text-lg font-bold tracking-[0.18em] text-gold">
          EXPENSE TRACKER
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="button button-ghost">Masuk</Link>
          <Link href="/register" className="button button-primary">Daftar</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:pt-24">
        <div>
          <p className="eyebrow">CATAT. KENDALIKAN. BERTUMBUH.</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-parchment sm:text-6xl">
            Jadikan setiap koin bagian dari <span className="text-gold">petualanganmu.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            Expense Tracker membantumu memahami arus uang, mencatat perjalanan finansial, dan menjaga saldo tetap pada jalurnya.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register" className="button button-primary button-lg">Mulai mencatat</Link>
            <Link href="/login" className="button button-secondary button-lg">Saya sudah punya akun</Link>
          </div>
        </div>

        <div className="card card-accent relative overflow-hidden p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
          <p className="eyebrow">PAPAN PETUALANGAN</p>
          <p className="mt-8 font-display text-sm tracking-widest text-muted">SALDO SAAT INI</p>
          <p className="mt-2 font-display text-4xl font-bold text-parchment">Rp 0</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="stat-box"><span className="text-success">PEMASUKAN</span><strong>Rp 0</strong></div>
            <div className="stat-box"><span className="text-danger">PENGELUARAN</span><strong>Rp 0</strong></div>
          </div>
          <p className="mt-8 border-t border-line pt-4 text-sm text-muted">Masuk untuk melihat riwayat transaksimu.</p>
        </div>
      </section>

      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-10 sm:grid-cols-3 lg:px-8">
          {features.map(([title, description]) => (
            <div key={title} className="border-l-2 border-gold/60 pl-4">
              <h2 className="font-display text-base font-semibold text-parchment">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
