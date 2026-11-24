import type { TAttendanceList, TAttendanceListParams, TAttendanceRecord } from "@/types/attendance";
import { attendanceQueryString } from "@/utils/attendance";
import { http } from "@/utils/http";
import type { TRecordAttendanceInput } from "./types";

function recordAttendance(input: TRecordAttendanceInput): Promise<TAttendanceRecord> {
  const body = new FormData();
  body.append("type", input.type);
  body.append("photo", input.photo, `${input.type.toLowerCase()}.jpg`);
  return http<TAttendanceRecord>("/attendances", { method: "POST", body });
}

function fetchMyAttendances(params: TAttendanceListParams): Promise<TAttendanceList> {
  return http<TAttendanceList>(`/attendances/me${attendanceQueryString(params)}`);
}

function myAttendancePhotoUrl(attendanceId: number): string {
  return `/api/attendances/me/${attendanceId}/photo`;
}

export { recordAttendance, fetchMyAttendances, myAttendancePhotoUrl };
