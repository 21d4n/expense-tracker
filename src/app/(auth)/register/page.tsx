import Link from "next/link";
import { requireGuest } from "@/lib/auth";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Daftar Akun — Expense Tracker",
  description: "Daftarkan akun Expense Tracker baru Anda.",
};

export default async function RegisterPage() {
  await requireGuest();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-bold tracking-tight text-text-primary hover:text-primary transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold text-sm">
            ET
          </div>
          <span>Expense Tracker</span>
        </Link>
        <p className="mt-2 text-sm text-text-secondary">
          Mulai atur pengeluaran dan anggaran keuangan pribadi Anda
        </p>
      </div>

      <RegisterForm />
    </main>
  );
}
