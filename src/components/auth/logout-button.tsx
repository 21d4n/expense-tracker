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
  className = "button button-ghost",
  children,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
      className="inline-flex"
    >
      <button
        type="submit"
        disabled={isPending}
        className={`cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {isPending ? "Keluar..." : children ?? "Keluar"}
      </button>
    </form>
  );
}
