import type { TAttendanceList, TAttendanceListParams } from "@/types/attendance";
import type {
  TCreateEmployeeInput,
  TEmployeeDetail,
  TEmployeeList,
  TEmployeeListParams,
  TUpdateEmployeeInput,
} from "./types";
import { attendanceQueryString } from "@/utils/attendance";
import { http } from "@/utils/http";
import { toQueryString } from "@/utils/query-string";

function fetchEmployees(params: TEmployeeListParams): Promise<TEmployeeList> {
  return http<TEmployeeList>(`/employees${toQueryString(params)}`);
}

function fetchEmployee(id: number): Promise<TEmployeeDetail> {
  return http<TEmployeeDetail>(`/employees/${id}`);
}

function fetchEmployeeAttendances(
  id: number,
  params: TAttendanceListParams,
): Promise<TAttendanceList> {
  return http<TAttendanceList>(`/employees/${id}/attendances${attendanceQueryString(params)}`);
}

function createEmployee(input: TCreateEmployeeInput): Promise<TEmployeeDetail> {
  return http<TEmployeeDetail>("/employees", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      username: input.username.trim().toLowerCase(),
    }),
  });
}

function updateEmployee(id: number, input: TUpdateEmployeeInput): Promise<TEmployeeDetail> {
  return http<TEmployeeDetail>(`/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export { fetchEmployees, fetchEmployee, fetchEmployeeAttendances, createEmployee, updateEmployee };
