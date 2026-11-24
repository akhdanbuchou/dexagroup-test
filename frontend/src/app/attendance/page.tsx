import { requireRole } from "@/utils/session";
import { ClockPanel } from "./ClockPanel";

export default async function AttendancePage() {
  const user = await requireRole("EMPLOYEE");
  return <ClockPanel name={user.name} />;
}
