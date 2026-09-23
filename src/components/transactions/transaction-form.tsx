"use client";

import { useActionState, useState } from "react";

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
  "w-full rounded border border-line bg-background px-4 py-3 text-parchment placeholder:text-muted/60 focus:border-gold focus:outline-none";
const labelClass = "mb-2 block font-display text-sm tracking-wide text-muted";
const errorClass = "mt-1 text-sm text-danger";

export default function TransactionForm(props: TransactionFormProps) {
  const isEdit = props.mode === "edit";
  const boundAction = isEdit ? updateTransaction.bind(null, props.id) : createTransaction;
  const [state, formAction, isPending] = useActionState(boundAction, INITIAL_STATE);
  const [today] = useState(todayLocal);

  const defaultType = isEdit ? props.defaultType : "EXPENSE";
  const defaultAmount = isEdit ? props.defaultAmount : "";
  const defaultDescription = isEdit ? props.defaultDescription : "";
  const defaultOccurredAt = isEdit ? props.defaultOccurredAt : today;

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <fieldset>
        <legend className={labelClass}>Tipe transaksi</legend>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex min-h-[40px] cursor-pointer items-center justify-center rounded border px-4 py-3 font-display text-sm ${
              defaultType === "INCOME"
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-muted"
            } has-checked:border-gold has-checked:bg-gold/10 has-checked:text-gold`}
          >
            <input
              type="radio"
              name="type"
              value="INCOME"
              defaultChecked={defaultType === "INCOME"}
              className="sr-only"
            />
            Pemasukan
          </label>
          <label
            className={`flex min-h-[40px] cursor-pointer items-center justify-center rounded border px-4 py-3 font-display text-sm ${
              defaultType === "EXPENSE"
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-muted"
            } has-checked:border-gold has-checked:bg-gold/10 has-checked:text-gold`}
          >
            <input
              type="radio"
              name="type"
              value="EXPENSE"
              defaultChecked={defaultType === "EXPENSE"}
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
          className={inputClass}
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

      <button type="submit" disabled={isPending} className="button button-primary min-h-[40px] w-full disabled:opacity-35">
        {isPending ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah transaksi"}
      </button>
    </form>
  );
}
