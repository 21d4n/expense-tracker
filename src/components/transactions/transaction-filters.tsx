"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { setTransactionFilterPreference, type TransactionFilter } from "@/actions/transactions";

const OPTIONS: ReadonlyArray<{ value: TransactionFilter; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "INCOME", label: "Pemasukan" },
  { value: "EXPENSE", label: "Pengeluaran" },
];

type TransactionFiltersProps = {
  // Nilai awal dibaca dari cookie preferensi di server (default: "all").
  initialValue?: TransactionFilter;
};

export default function TransactionFilters({ initialValue = "all" }: TransactionFiltersProps) {
  const [value, setValue] = useState<TransactionFilter>(initialValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function select(next: TransactionFilter) {
    if (next === value) return;
    setValue(next);
    startTransition(async () => {
      // Simpan preferensi ke cookie biasa + sinkronkan query ?filter= untuk halaman daftar.
      const saved = await setTransactionFilterPreference(next);
      setValue(saved);
      router.replace(`${pathname}?filter=${saved}`, { scroll: false });
    });
  }

  return (
    <div role="group" aria-label="Filter transaksi" className="grid grid-cols-3 gap-2">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            disabled={isPending}
            onClick={() => select(option.value)}
            className={`min-h-[40px] rounded border px-3 py-2 font-display text-sm transition disabled:opacity-35 ${
              active ? "border-gold bg-gold/15 text-gold" : "border-line text-muted hover:text-parchment"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
