import Link from "next/link";

export default function TransactionNotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <p className="eyebrow">TIDAK DITEMUKAN</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-parchment">Transaksi tidak ditemukan</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Transaksi mungkin sudah dihapus atau bukan milik akunmu.
      </p>
      <Link href="/dashboard" className="button button-primary mt-6 min-h-[40px]">
        Kembali ke dashboard
      </Link>
    </main>
  );
}
