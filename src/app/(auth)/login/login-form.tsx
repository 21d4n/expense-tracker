"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthActionState } from "@/actions/auth";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="card w-full max-w-md p-8 shadow-xl border-border bg-surface">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Masuk ke Akun
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Masukkan kredensial akun Anda untuk mengakses dashboard.
        </p>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-danger/40 bg-danger/10 p-3.5 text-sm text-danger flex items-start gap-2.5"
        >
          <svg className="h-5 w-5 shrink-0 text-danger mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="leading-snug">{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Alamat Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email ?? ""}
            disabled={isPending}
            placeholder="nama@domain.com"
            className={`w-full rounded-lg border bg-surface-elevated px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 ${
              state.fieldErrors?.email ? "border-danger ring-1 ring-danger" : "border-border"
            }`}
          />
          {state.fieldErrors?.email && (
            <p className="mt-1.5 text-xs text-danger">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary"
            >
              Kata Sandi
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isPending}
            placeholder="••••••••"
            className={`w-full rounded-lg border bg-surface-elevated px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 ${
              state.fieldErrors?.password ? "border-danger ring-1 ring-danger" : "border-border"
            }`}
          />
          {state.fieldErrors?.password && (
            <p className="mt-1.5 text-xs text-danger">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="button button-primary button-lg mt-6 w-full cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? "Memverifikasi..." : "Masuk ke Dashboard"}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center text-sm text-text-secondary">
        <span>Belum memiliki akun? </span>
        <Link
          href="/register"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
