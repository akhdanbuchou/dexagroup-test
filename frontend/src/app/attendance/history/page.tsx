import { requireRole } from "@/utils/session";
import { HistoryTable } from "./HistoryTable";

export default async function AttendanceHistoryPage() {
  await requireRole("EMPLOYEE");
  return <HistoryTable />;
}
