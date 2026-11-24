"use client";

import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { App, Button, Card, Descriptions, Flex, Skeleton, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { AttendanceTable } from "@/components/AttendanceTable";
import { QueryErrorAlert } from "@/components/QueryErrorAlert";
import { useAttendanceFilters } from "@/components/useAttendanceFilters";
import { useEmployee, useEmployeeAttendances } from "../hooks";
import type { TEmployeeDetailViewProps } from "../types";
import { formatDateOnly } from "@/utils/date";
import { HttpError } from "@/utils/http";
import { EmployeeFormModal } from "./EmployeeFormModal";
import { EmployeeNotFound } from "./EmployeeNotFound";

const PAGE_SIZE = 10;

export function EmployeeDetailView({ employeeId }: TEmployeeDetailViewProps) {
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);

  const { filters, setFilters } = useAttendanceFilters();

  const employeeQuery = useEmployee(employeeId);
  const attendanceQuery = useEmployeeAttendances(employeeId, {
    ...filters,
    pageSize: PAGE_SIZE,
  });

  if (employeeQuery.error instanceof HttpError && employeeQuery.error.status === 404) {
    return <EmployeeNotFound />;
  }

  if (employeeQuery.error && !employeeQuery.data) {
    return <QueryErrorAlert error={employeeQuery.error} onRetry={() => employeeQuery.refetch()} />;
  }

  const employee = employeeQuery.data;
  if (!employee) {
    return (
      <Flex vertical gap={24}>
        <Skeleton active title={{ width: 240 }} paragraph={{ rows: 1 }} />
        <Card>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
        <Card>
          <Skeleton active paragraph={{ rows: 5 }} />
        </Card>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="flex-start" gap={16} wrap>
        <Flex vertical gap={4}>
          <Link href="/admin">
            <Button type="link" icon={<ArrowLeftOutlined />} style={{ padding: 0 }}>
              Back to employees
            </Button>
          </Link>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {employee.name}
          </Typography.Title>
          <Typography.Text type="secondary">{employee.position}</Typography.Text>
        </Flex>
        <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
          Edit Employee
        </Button>
      </Flex>

      <Card title="Employee Details">
        <Descriptions
          column={{ xs: 1, sm: 2, lg: 3 }}
          items={[
            { key: "name", label: "Full name", children: employee.name },
            {
              key: "username",
              label: "Username",
              children: employee.username ? `@${employee.username}` : "—",
            },
            { key: "position", label: "Position", children: employee.position },
            {
              key: "dob",
              label: "Date of birth",
              children: formatDateOnly(employee.dateOfBirth),
            },
            { key: "age", label: "Age", children: `${employee.age} years` },
            {
              key: "records",
              label: "Attendance records",
              children: employee.attendanceCount,
            },
          ]}
        />
      </Card>

      {attendanceQuery.error && !attendanceQuery.data ? (
        <QueryErrorAlert error={attendanceQuery.error} onRetry={() => attendanceQuery.refetch()} />
      ) : (
        <AttendanceTable
          result={attendanceQuery.data}
          loading={attendanceQuery.isPending || attendanceQuery.isFetching}
          filters={filters}
          pageSize={PAGE_SIZE}
          photoUrl={(record) => `/api/employees/${employee.id}/attendances/${record.id}/photo`}
          photoAlt={(record) =>
            `${employee.name} ${record.type === "CLOCK_IN" ? "clock-in" : "clock-out"} photo`
          }
          onFilterChange={setFilters}
        />
      )}

      <EmployeeFormModal
        open={editing}
        mode="edit"
        employee={employee}
        onClose={() => setEditing(false)}
        onSaved={(updated) => {
          message.success(`${updated.name} has been updated`);
          setEditing(false);
        }}
      />
    </Flex>
  );
}
