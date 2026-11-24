import type { TAttendanceListParams } from "@/types/attendance";
import { endOfDayIso, startOfDayIso } from "./date";
import { toQueryString } from "./query-string";

function attendanceQueryString(params: TAttendanceListParams): string {
  return toQueryString({
    from: params.from ? startOfDayIso(params.from) : null,
    to: params.to ? endOfDayIso(params.to) : null,
    page: params.page,
    pageSize: params.pageSize,
  });
}

export { attendanceQueryString };
