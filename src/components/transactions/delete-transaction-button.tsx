"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteTransaction } from "@/actions/transactions";

type DeleteTransactionButtonProps = {
  id: string;
  description: string;
};

export default function DeleteTransactionButton({ id, description }: DeleteTransactionButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    // Cegah pengiriman ganda saat pending (SRS fase 2 §4.1).
    if (isPending) return;
    setError("");
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result.ok) {
        // Sukses: ambil ulang data dashboard tanpa hard reload (FR-11).
        // Server action sudah merevalidasi /dashboard dan /dashboard/budgets.
        // Posisi scroll dan filter ?type= tetap karena tidak pindah halaman.
        setConfirming(false);
        router.refresh();
      } else {
        setError(result.message);
        setConfirming(false);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="button min-h-[40px] border border-danger/60 px-4 py-2 font-display text-sm text-danger hover:bg-danger/10"
      >
        Hapus
      </button>

      {confirming ? (
        <div role="dialog" aria-modal="true" aria-label="Konfirmasi hapus transaksi" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="card card-accent w-full max-w-sm p-6">
            <p className="eyebrow">HAPUS TRANSAKSI</p>
            <p className="mt-3 text-sm leading-6 text-parchment">
              Hapus transaksi &ldquo;{description}&rdquo;? Tindakan ini tidak dapat dibatalkan.
            </p>
            {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={isPending}
                className="button button-secondary min-h-[40px] disabled:opacity-35"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="button min-h-[40px] bg-danger font-display text-sm text-background hover:brightness-110 disabled:opacity-35"
              >
                {isPending ? "Menghapus..." : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {error && !confirming ? (
        <p role="alert" className="mt-2 text-sm text-danger">{error}</p>
      ) : null}
    </div>
  );
}
