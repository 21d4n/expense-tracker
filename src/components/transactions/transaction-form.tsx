"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createTransaction,
  updateTransaction,
  type TransactionFormState,
} from "@/actions/transactions";

const INITIAL_STATE: TransactionFormState = { ok: false, message: "", fieldErrors: {} };

type TransactionFormProps =
  | { mode: "create" }
  | {
      mode: "edit";
      id: string;
      defaultType: "INCOME" | "EXPENSE";
      defaultAmount: string;
      defaultDescription: string;
      defaultOccurredAt: string;
    };

function todayLocal(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const inputClass =
  "w-full rounded border border-border bg-surface-elevated px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-primary";
const labelClass = "mb-2 block text-sm font-medium tracking-wide text-text-secondary";
const errorClass = "mt-1 text-sm text-danger";

export default function TransactionForm(props: TransactionFormProps) {
  const isEdit = props.mode === "edit";
  const boundAction = isEdit ? updateTransaction.bind(null, props.id) : createTransaction;
  const [state, formAction, isPending] = useActionState(boundAction, INITIAL_STATE);
  const router = useRouter();
  const [today] = useState(todayLocal);

  // Sukses: navigasi client-side ke dashboard tanpa hard reload (FR-11).
  // Server action sudah merevalidasi /dashboard dan /dashboard/budgets.
  useEffect(() => {
    if (state.ok) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state.ok, router]);

  const defaultType = isEdit ? props.defaultType : "EXPENSE";
  // Live state agar highlight mengikuti pilihan aktif, bukan nilai awal statis.
  const [selectedType, setSelectedType] = useState<"INCOME" | "EXPENSE">(defaultType);
  const defaultAmount = isEdit ? props.defaultAmount : "";
  const defaultDescription = isEdit ? props.defaultDescription : "";
  const defaultOccurredAt = isEdit ? props.defaultOccurredAt : today;

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <fieldset>
        <legend className={labelClass}>Tipe transaksi</legend>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex min-h-[40px] cursor-pointer items-center justify-center rounded border px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-primary ${
              selectedType === "INCOME"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-text-secondary"
            }`}
          >
            <input
              type="radio"
              name="type"
              value="INCOME"
              checked={selectedType === "INCOME"}
              onChange={() => setSelectedType("INCOME")}
              className="sr-only"
            />
            Pemasukan
          </label>
          <label
            className={`flex min-h-[40px] cursor-pointer items-center justify-center rounded border px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-primary ${
              selectedType === "EXPENSE"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-text-secondary"
            }`}
          >
            <input
              type="radio"
              name="type"
              value="EXPENSE"
              checked={selectedType === "EXPENSE"}
              onChange={() => setSelectedType("EXPENSE")}
              className="sr-only"
            />
            Pengeluaran
          </label>
        </div>
        {state.fieldErrors.type ? (
          <p className={errorClass}>{state.fieldErrors.type.join(", ")}</p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor="amount" className={labelClass}>
          Nominal (Rp)
        </label>
        <input
          id="amount"
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="cth. 150000"
          defaultValue={defaultAmount}
          className={`${inputClass} tabular-nums`}
          aria-invalid={Boolean(state.fieldErrors.amount)}
        />
        {state.fieldErrors.amount ? (
          <p className={errorClass}>{state.fieldErrors.amount.join(", ")}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi
        </label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="cth. Gaji bulanan"
          defaultValue={defaultDescription}
          maxLength={500}
          className={inputClass}
          aria-invalid={Boolean(state.fieldErrors.description)}
        />
        {state.fieldErrors.description ? (
          <p className={errorClass}>{state.fieldErrors.description.join(", ")}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="occurredAt" className={labelClass}>
          Tanggal transaksi
        </label>
        <input
          id="occurredAt"
          name="occurredAt"
          type="date"
          defaultValue={defaultOccurredAt}
          className={inputClass}
          aria-invalid={Boolean(state.fieldErrors.occurredAt)}
        />
        {state.fieldErrors.occurredAt ? (
          <p className={errorClass}>{state.fieldErrors.occurredAt.join(", ")}</p>
        ) : null}
      </div>

      {!state.ok && state.message ? (
        <p role="alert" className="rounded border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      {state.ok && state.message ? (
        <p role="status" className="rounded border border-success/50 bg-success/10 px-4 py-3 text-sm text-success">
          {state.message} Mengalihkan...
        </p>
      ) : null}

      <button type="submit" disabled={isPending || state.ok} aria-disabled={isPending || state.ok} className="button button-primary min-h-[40px] w-full disabled:opacity-35">
        {isPending ? "Menyimpan..." : state.ok ? "Berhasil..." : isEdit ? "Simpan perubahan" : "Tambah transaksi"}
      </button>
    </form>
  );
}
