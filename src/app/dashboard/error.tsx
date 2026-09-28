"use client";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="card card-accent p-8 text-center">
        <h1 className="text-xl font-semibold text-text-primary">Dashboard gagal dimuat</h1>
        <p className="mt-2 text-sm text-text-secondary">Coba lagi dalam beberapa saat.</p>
        <button type="button" onClick={reset} className="button button-primary mt-6">
          Coba lagi
        </button>
      </div>
    </main>
  );
}
