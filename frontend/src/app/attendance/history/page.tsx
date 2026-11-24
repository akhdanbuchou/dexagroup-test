import { requireRole } from "@/utils/session";
import { HistoryTable } from "@/modules/attendance";

export default async function AttendanceHistoryPage() {
  await requireRole("EMPLOYEE");
  return <HistoryTable />;
}
