export default function AuthLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Brand skeleton */}
      <div className="mb-8 flex flex-col items-center">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-surface-elevated" />
        <div className="mt-2.5 h-4 w-60 animate-pulse rounded bg-surface-elevated/60" />
      </div>

      {/* Card skeleton */}
      <div className="card w-full max-w-md p-8 shadow-xl border-border bg-surface">
        <div className="mb-6 space-y-2.5">
          <div className="h-6 w-36 animate-pulse rounded-lg bg-surface-elevated" />
          <div className="h-4 w-64 animate-pulse rounded bg-surface-elevated/60" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-surface-elevated" />
            <div className="h-10 w-full animate-pulse rounded-lg border border-border bg-surface-elevated/40" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-elevated" />
            <div className="h-10 w-full animate-pulse rounded-lg border border-border bg-surface-elevated/40" />
          </div>

          <div className="mt-6 h-11 w-full animate-pulse rounded-lg bg-primary/20" />
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-surface-elevated/60" />
        </div>
      </div>
    </main>
  );
}
