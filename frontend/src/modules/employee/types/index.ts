import type { Dayjs } from "dayjs";
import type { TPaginated } from "@/types/api";

type TEmployee = {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  age: number;
  username: string | null;
};

type TEmployeeDetail = TEmployee & {
  attendanceCount: number;
  createdAt: string;
  updatedAt: string;
};

type TCreateEmployeeInput = {
  name: string;
  dateOfBirth: string;
  position: string;
  username: string;
  password: string;
};

type TUpdateEmployeeInput = {
  name: string;
  dateOfBirth: string;
  position: string;
};

type TEmployeeFormMode = "create" | "edit";

type TEmployeeFormValues = {
  name: string;
  dateOfBirth: Dayjs;
  position: string;
  username?: string;
  password?: string;
};

type TEmployeeModalState = {
  mode: TEmployeeFormMode;
  employee?: TEmployee;
} | null;

type TEmployeeFormModalProps = {
  open: boolean;
  mode: TEmployeeFormMode;
  employee?: TEmployee;
  onClose: () => void;
  onSaved: (employee: TEmployeeDetail) => void;
};

type TEmployeeListQuery = {
  search?: string;
  page?: number;
};

type TEmployeeListParams = {
  search: string;
  page: number;
  pageSize: number;
};

type TUpdateEmployeeVariables = {
  id: number;
  input: TUpdateEmployeeInput;
};

type TEmployeeList = TPaginated<TEmployee>;

type TEmployeeDetailViewProps = {
  employeeId: number;
};

export type {
  TEmployee,
  TEmployeeDetail,
  TCreateEmployeeInput,
  TUpdateEmployeeInput,
  TEmployeeFormMode,
  TEmployeeFormValues,
  TEmployeeModalState,
  TEmployeeFormModalProps,
  TEmployeeListQuery,
  TEmployeeListParams,
  TUpdateEmployeeVariables,
  TEmployeeList,
  TEmployeeDetailViewProps,
};
