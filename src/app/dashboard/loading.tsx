export default function DashboardLoading() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:px-8" aria-busy="true" aria-label="Memuat dashboard">
      <div className="card h-16 animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card card-accent h-32 animate-pulse" />
        <div className="card h-32 animate-pulse" />
        <div className="card h-32 animate-pulse" />
      </div>
      <div className="grid gap-3">
        <div className="card h-20 animate-pulse" />
        <div className="card h-20 animate-pulse" />
        <div className="card h-20 animate-pulse" />
      </div>
    </main>
  );
}
