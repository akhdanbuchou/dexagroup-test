import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireRole } from "@/utils/session";
import { EmployeeDetailView } from "./EmployeeDetailView";

export default async function EmployeeDetailPage({ params }: PageProps<"/admin/employees/[id]">) {
  await requireRole("HR_ADMIN");
  const { id } = await params;

  const employeeId = Number(id);
  if (!Number.isInteger(employeeId) || employeeId < 1) {
    notFound();
  }

  return (
    <Suspense>
      <EmployeeDetailView employeeId={employeeId} />
    </Suspense>
  );
}
