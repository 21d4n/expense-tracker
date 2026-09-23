export default function AuthLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Brand skeleton */}
      <div className="mb-8 flex flex-col items-center">
        <div className="h-6 w-48 animate-pulse rounded bg-surface" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-surface/60" />
      </div>

      {/* Card skeleton */}
      <div className="card card-accent relative w-full max-w-md p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

        <div className="mb-6 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-gold/20" />
          <div className="h-7 w-40 animate-pulse rounded bg-surface-elevated" />
          <div className="h-4 w-72 animate-pulse rounded bg-surface" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-3 w-28 animate-pulse rounded bg-surface-elevated" />
            <div className="h-10 w-full animate-pulse rounded border border-line/40 bg-surface/50" />
          </div>

          <div className="space-y-1.5">
            <div className="h-3 w-24 animate-pulse rounded bg-surface-elevated" />
            <div className="h-10 w-full animate-pulse rounded border border-line/40 bg-surface/50" />
          </div>

          <div className="mt-6 h-11 w-full animate-pulse rounded bg-gold/20" />
        </div>

        <div className="mt-8 border-t border-line/40 pt-6">
          <div className="mx-auto h-4 w-52 animate-pulse rounded bg-surface" />
        </div>
      </div>
    </main>
  );
}
