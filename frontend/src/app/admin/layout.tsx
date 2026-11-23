import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/utils/session";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireRole("HR_ADMIN");
  return <AppShell user={user}>{children}</AppShell>;
}
