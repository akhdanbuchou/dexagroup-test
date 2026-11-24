import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./jwt";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${BACKEND_URL}${path}`, { ...init, headers, cache: "no-store" });
}

export { backendFetch };
