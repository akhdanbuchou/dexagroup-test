import { jwtVerify } from "jose";
import type { TSessionUser } from "@/types/user";
import { isRole } from "./roles";

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<TSessionUser | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "number" || !isRole(payload.role)) {
      return null;
    }
    return {
      userId: payload.sub,
      username: String(payload.username),
      role: payload.role,
      employeeId:
        typeof payload.employeeId === "number" ? payload.employeeId : null,
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}
