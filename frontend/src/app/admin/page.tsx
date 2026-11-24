import { Suspense } from "react";
import { requireRole } from "@/utils/session";
import { EmployeeTable } from "@/modules/employee";

export default async function AdminDashboardPage() {
  await requireRole("HR_ADMIN");
  return (
    <Suspense>
      <EmployeeTable />
    </Suspense>
  );
}
