"use client";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid max-w-6xl gap-4 px-6 py-10 lg:px-8">
      <div className="card card-accent p-8 text-center">
        <p className="eyebrow">GAGAL MEMUAT</p>
        <p className="mt-3 text-lg text-parchment">Dashboard tidak dapat dimuat saat ini.</p>
        <p className="mt-1 text-sm text-muted">Coba lagi; jika berlanjut, masuk ulang ke akunmu.</p>
        <button type="button" onClick={reset} className="button button-primary mt-6">
          Coba lagi
        </button>
      </div>
    </main>
  );
}
