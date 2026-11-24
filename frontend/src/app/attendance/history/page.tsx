import { Suspense } from "react";
import { HistoryTable } from "@/modules/attendance";
import { requireRole } from "@/utils/session";

export default async function AttendanceHistoryPage() {
  await requireRole("EMPLOYEE");
  return (
    <Suspense>
      <HistoryTable />
    </Suspense>
  );
}
