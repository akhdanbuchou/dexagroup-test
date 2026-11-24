import { requireRole } from "@/utils/session";
import { ClockPanel } from "@/modules/attendance";

export default async function AttendancePage() {
  const user = await requireRole("EMPLOYEE");
  return <ClockPanel name={user.name} />;
}
