"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthActionState } from "@/actions/auth";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="card card-accent relative w-full max-w-md p-8 shadow-2xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />

      <div className="mb-6">
        <span className="eyebrow">PORTAL MASUK</span>
        <h1 className="mt-1 font-display text-2xl font-bold text-parchment">
          Masuk ke Akun
        </h1>
        <p className="mt-1 text-sm text-muted">
          Lanjutkan perjalanan dan pantau kembali aliran hartamu.
        </p>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-6 rounded-sm border border-danger/60 bg-danger/10 p-3.5 text-xs leading-relaxed text-danger"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-display text-xs font-semibold tracking-wider text-parchment"
          >
            ALAMAT EMAIL
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
            className={`w-full rounded-sm border bg-[#1a0f0a] px-3.5 py-2.5 text-sm text-parchment placeholder:text-muted/50 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50 ${
              state.fieldErrors?.email ? "border-danger" : "border-line"
            }`}
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-xs text-danger">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="mb-1.5 block font-display text-xs font-semibold tracking-wider text-parchment"
            >
              KATA SANDI
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
            className={`w-full rounded-sm border bg-[#1a0f0a] px-3.5 py-2.5 text-sm text-parchment placeholder:text-muted/50 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50 ${
              state.fieldErrors?.password ? "border-danger" : "border-line"
            }`}
          />
          {state.fieldErrors?.password && (
            <p className="mt-1 text-xs text-danger">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="button button-primary button-lg mt-6 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "MEMERIKSA KREDENSIAL..." : "MASUK KE DASHBOARD"}
        </button>
      </form>

      <div className="mt-8 border-t border-line/60 pt-6 text-center text-sm text-muted">
        <span>Belum memiliki akun petualang? </span>
        <Link
          href="/register"
          className="font-display font-semibold text-gold transition-colors hover:text-gold-bright hover:underline"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
