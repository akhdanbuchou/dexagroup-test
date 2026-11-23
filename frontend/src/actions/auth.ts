"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/utils/jwt";
import { isRole, ROLE_HOME } from "@/utils/roles";
import type { TLoginInput, TLoginState } from "@/types/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function login(
  _prev: TLoginState,
  input: TLoginInput,
): Promise<TLoginState> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: input.username?.trim(),
        password: input.password,
      }),
      cache: "no-store",
    });
  } catch {
    return { error: "Unable to reach the server. Please try again later." };
  }

  if (response.status === 401 || response.status === 400) {
    return { error: "Invalid username or password." };
  }
  if (!response.ok) {
    return { error: "Something went wrong. Please try again." };
  }

  const data: { accessToken: string; user: { role: unknown } } =
    await response.json();
  if (!isRole(data.user.role)) {
    return { error: "Your account has an unsupported role." };
  }

  (await cookies()).set(SESSION_COOKIE, data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(ROLE_HOME[data.user.role]);
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
