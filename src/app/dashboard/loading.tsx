export default function DashboardLoading() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10" aria-busy="true" aria-label="Memuat dashboard">
      <div className="card h-16 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card card-accent h-32 animate-pulse" />
        <div className="card h-32 animate-pulse" />
        <div className="card h-32 animate-pulse" />
      </div>
      <div className="card h-12 animate-pulse" />
      <div className="card h-48 animate-pulse" />
      <div className="grid gap-3">
        <div className="card h-20 animate-pulse" />
        <div className="card h-20 animate-pulse" />
        <div className="card h-20 animate-pulse" />
      </div>
    </main>
  );
}
