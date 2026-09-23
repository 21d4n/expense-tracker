"use client";

import { useTransition } from "react";
import { logoutAction } from "@/actions/auth";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Komponen tombol logout siap pakai (FR-08) dengan tema QuestUI.
 * Menggunakan Server Action logoutAction dan useTransition untuk status loading.
 */
export function LogoutButton({
  className = "button button-ghost text-xs text-danger/80 hover:text-danger hover:border-danger/40",
  children,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
      className={`cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isPending ? "Keluar..." : children ?? "Keluar"}
    </button>
  );
}
