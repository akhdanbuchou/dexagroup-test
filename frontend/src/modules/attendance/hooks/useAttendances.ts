import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TAttendanceListParams } from "@/types/attendance";
import { todayDateParam } from "@/utils/date";
import { fetchMyAttendances, recordAttendance } from "../client";

const TODAY_PAGE_SIZE = 50;

const attendanceKeys = {
  all: ["attendances"] as const,
  mine: () => [...attendanceKeys.all, "me"] as const,
  list: (params: TAttendanceListParams) => [...attendanceKeys.mine(), "list", params] as const,
  today: (date: string) => [...attendanceKeys.mine(), "today", date] as const,
};

function useMyAttendances(params: TAttendanceListParams) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => fetchMyAttendances(params),
    placeholderData: keepPreviousData,
  });
}

function useTodayAttendances() {
  const today = todayDateParam();
  return useQuery({
    queryKey: attendanceKeys.today(today),
    queryFn: () =>
      fetchMyAttendances({ from: today, to: today, page: 1, pageSize: TODAY_PAGE_SIZE }),
  });
}

function useRecordAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordAttendance,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: attendanceKeys.mine() }),
  });
}

export { attendanceKeys, useMyAttendances, useTodayAttendances, useRecordAttendance };
