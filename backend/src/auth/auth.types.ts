import type { Role } from '../generated/prisma/enums.js';

type TJwtPayload = {
  sub: number;
  username: string;
  role: Role;
  employeeId: number | null;
  name: string;
};

type TAuthenticatedRequest = {
  user?: TJwtPayload;
  headers: Record<string, string | string[] | undefined>;
};

export type { TJwtPayload, TAuthenticatedRequest };
