export default function BudgetsLoading() {
  return (
    <main className="min-h-screen bg-background text-text-primary pb-16">
      {/* Top Header Skeleton */}
      <header className="border-b border-border bg-surface/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 animate-pulse rounded-lg bg-surface-elevated" />
            <div className="h-4 w-32 animate-pulse rounded bg-surface-elevated" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 animate-pulse rounded-lg bg-surface-elevated" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-surface-elevated" />
          </div>
        </div>
      </header>

      {/* Main Skeleton */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-elevated" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-surface-elevated/60" />
        </div>

        {/* Month Selector Skeleton */}
        <div className="card p-5 bg-surface border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-surface-elevated" />
            <div className="h-6 w-40 animate-pulse rounded bg-surface-elevated" />
          </div>
          <div className="h-10 w-full sm:w-56 animate-pulse rounded-lg bg-surface-elevated" />
        </div>

        {/* Status Card Skeleton */}
        <div className="card p-6 sm:p-8 border-border bg-surface space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-5">
            <div className="space-y-2">
              <div className="h-3 w-40 animate-pulse rounded bg-surface-elevated" />
              <div className="h-6 w-48 animate-pulse rounded bg-surface-elevated" />
            </div>
            <div className="h-6 w-28 animate-pulse rounded-full bg-surface-elevated" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="h-20 animate-pulse rounded-xl bg-surface-elevated" />
            <div className="h-20 animate-pulse rounded-xl bg-surface-elevated" />
            <div className="h-20 animate-pulse rounded-xl bg-surface-elevated" />
          </div>

          <div className="h-6 w-full animate-pulse rounded-full bg-surface-elevated" />
        </div>

        {/* Form Skeleton */}
        <div className="card p-6 sm:p-8 border-border bg-surface space-y-6">
          <div className="space-y-2 border-b border-border pb-5">
            <div className="h-3 w-32 animate-pulse rounded bg-surface-elevated" />
            <div className="h-6 w-48 animate-pulse rounded bg-surface-elevated" />
            <div className="h-4 w-72 animate-pulse rounded bg-surface-elevated/60" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-36 animate-pulse rounded bg-surface-elevated" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-surface-elevated" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <div className="h-10 w-36 animate-pulse rounded-lg bg-surface-elevated" />
            <div className="h-10 w-36 animate-pulse rounded-lg bg-primary/20" />
          </div>
        </div>
      </div>
    </main>
  );
}
