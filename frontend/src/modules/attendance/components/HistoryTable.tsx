"use client";

import { AttendanceTable } from "@/components/AttendanceTable";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorAlert } from "@/components/QueryErrorAlert";
import { useAttendanceFilters } from "@/components/useAttendanceFilters";
import { myAttendancePhotoUrl } from "../client";
import { useMyAttendances } from "../hooks";

const PAGE_SIZE = 10;

export function HistoryTable() {
  const { filters, setFilters } = useAttendanceFilters();
  const query = useMyAttendances({ ...filters, pageSize: PAGE_SIZE });

  return (
    <>
      <PageHeader
        title="Attendance History"
        description="All of your recorded WFH clock-ins and clock-outs."
      />
      {query.error && !query.data ? (
        <QueryErrorAlert error={query.error} onRetry={() => query.refetch()} />
      ) : (
        <AttendanceTable
          title="My Records"
          result={query.data}
          loading={query.isPending || query.isFetching}
          filters={filters}
          pageSize={PAGE_SIZE}
          photoUrl={(record) => myAttendancePhotoUrl(record.id)}
          photoAlt={(record) =>
            `Your ${record.type === "CLOCK_IN" ? "clock-in" : "clock-out"} photo`
          }
          onFilterChange={setFilters}
        />
      )}
    </>
  );
}
