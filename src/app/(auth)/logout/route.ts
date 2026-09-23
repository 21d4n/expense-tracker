import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

/**
 * Route handler untuk endpoint /logout (FR-08).
 * Menghapus session dari database dan cookie, lalu mengarahkan ke /login.
 */
export async function GET(request: Request) {
  await deleteSession();
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export async function POST(request: Request) {
  await deleteSession();
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}
