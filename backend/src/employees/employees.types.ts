type TEmployeeSummary = {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  age: number;
  username: string | null;
};

type TEmployeeDetail = TEmployeeSummary & {
  attendanceCount: number;
  createdAt: string;
  updatedAt: string;
};

export type { TEmployeeSummary, TEmployeeDetail };
