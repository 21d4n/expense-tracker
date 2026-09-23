import Link from "next/link";
import { requireGuest } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Masuk — Expense Tracker",
  description: "Masuk ke akun Expense Tracker Anda.",
};

export default async function LoginPage() {
  await requireGuest();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-[0.2em] text-gold transition-colors hover:text-gold-bright"
        >
          EXPENSE TRACKER
        </Link>
        <p className="mt-2 text-sm text-muted">
          Pintu masuk menuju catatan petualangan finansialmu
        </p>
      </div>

      <LoginForm />
    </main>
  );
}
