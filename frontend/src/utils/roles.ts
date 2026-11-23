import type { TRole } from "@/types/user";

export const ROLE_HOME: Record<TRole, string> = {
  HR_ADMIN: "/admin",
  EMPLOYEE: "/attendance",
};

export const ROLE_LABEL: Record<TRole, string> = {
  HR_ADMIN: "HR Admin",
  EMPLOYEE: "Employee",
};

export function isRole(value: unknown): value is TRole {
  return value === "HR_ADMIN" || value === "EMPLOYEE";
}
