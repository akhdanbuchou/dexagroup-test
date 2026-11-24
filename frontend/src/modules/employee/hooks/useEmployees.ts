import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  fetchEmployee,
  fetchEmployeeAttendances,
  fetchEmployees,
  updateEmployee,
} from "../client";
import type {
  TAttendanceListParams,
  TEmployeeListParams,
  TUpdateEmployeeVariables,
} from "../types";

const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: TEmployeeListParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  attendances: (id: number) => [...employeeKeys.detail(id), "attendances"] as const,
  attendanceList: (id: number, params: TAttendanceListParams) =>
    [...employeeKeys.attendances(id), params] as const,
};

function useEmployees(params: TEmployeeListParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => fetchEmployees(params),
    placeholderData: keepPreviousData,
  });
}

function useEmployee(id: number) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployee(id),
  });
}

function useEmployeeAttendances(id: number, params: TAttendanceListParams) {
  return useQuery({
    queryKey: employeeKeys.attendanceList(id, params),
    queryFn: () => fetchEmployeeAttendances(id, params),
    placeholderData: keepPreviousData,
  });
}

function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (employee) => {
      queryClient.setQueryData(employeeKeys.detail(employee.id), employee);
      return queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: TUpdateEmployeeVariables) => updateEmployee(id, input),
    onSuccess: (employee) => {
      queryClient.setQueryData(employeeKeys.detail(employee.id), employee);
      return queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export {
  employeeKeys,
  useEmployees,
  useEmployee,
  useEmployeeAttendances,
  useCreateEmployee,
  useUpdateEmployee,
};
