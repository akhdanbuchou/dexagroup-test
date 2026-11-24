import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/utils/session";

export default async function AttendanceLayout({ children }: LayoutProps<"/attendance">) {
  const user = await requireRole("EMPLOYEE");
  return <AppShell user={user}>{children}</AppShell>;
}
