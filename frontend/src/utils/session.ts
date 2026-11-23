import "server-only";
import { cookies } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import type { TRole, TSessionUser } from "@/types/user";
import { SESSION_COOKIE, verifySessionToken } from "./jwt";

export async function getSession(): Promise<TSessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireRole(role: TRole): Promise<TSessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== role) {
    unauthorized();
  }
  return session;
}
