type TRole = "HR_ADMIN" | "EMPLOYEE";

type TSessionUser = {
  userId: number;
  username: string;
  role: TRole;
  employeeId: number | null;
  name: string;
};

export type { TRole, TSessionUser };
