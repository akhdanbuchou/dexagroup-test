"use client";

import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Empty,
  Flex,
  Image,
  Skeleton,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { QueryErrorAlert } from "@/components/QueryErrorAlert";
import { useEmployee, useEmployeeAttendances } from "../hooks";
import type { TAttendanceRecord } from "@/types/attendance";
import type { TAttendanceFilterQuery, TEmployeeDetailViewProps } from "../types";
import {
  DATE_PARAM_FORMAT,
  formatDate,
  formatDateOnly,
  formatTime,
  formatWeekday,
  isDateParam,
} from "@/utils/date";
import { HttpError } from "@/utils/http";
import { EmployeeFormModal } from "./EmployeeFormModal";
import { EmployeeNotFound } from "./EmployeeNotFound";

const PAGE_SIZE = 10;

export function EmployeeDetailView({ employeeId }: TEmployeeDetailViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const from = isDateParam(fromParam) ? fromParam : null;
  const to = isDateParam(toParam) ? toParam : null;
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "", 10) || 1);

  const employeeQuery = useEmployee(employeeId);
  const attendanceQuery = useEmployeeAttendances(employeeId, {
    from,
    to,
    page,
    pageSize: PAGE_SIZE,
  });

  const navigate = (params: TAttendanceFilterQuery) => {
    const next = new URLSearchParams();
    const nextFrom = params.from === undefined ? from : params.from;
    const nextTo = params.to === undefined ? to : params.to;
    if (nextFrom) next.set("from", nextFrom);
    if (nextTo) next.set("to", nextTo);
    if (params.page && params.page > 1) next.set("page", String(params.page));
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

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

  const columns: TableProps<TAttendanceRecord>["columns"] = [
    {
      title: "Date",
      key: "date",
      render: (_, record) => (
        <Flex vertical>
          <Typography.Text>{formatDate(record.recordedAt)}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {formatWeekday(record.recordedAt)}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: TAttendanceRecord["type"]) =>
        type === "CLOCK_IN" ? (
          <Tag color="red">Clock In</Tag>
        ) : (
          <Tag color="default">Clock Out</Tag>
        ),
    },
    {
      title: "Time (WIB)",
      key: "time",
      render: (_, record) => (
        <Typography.Text style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatTime(record.recordedAt)}
        </Typography.Text>
      ),
    },
    {
      title: "Photo",
      key: "photo",
      width: 110,
      render: (_, record) => (
        <Image
          src={`/api/employees/${employee.id}/attendances/${record.id}/photo`}
          alt={`${employee.name} ${record.type === "CLOCK_IN" ? "clock-in" : "clock-out"} photo`}
          width={72}
          height={54}
          style={{ objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
  ];

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

      <Card
        title="WFH Attendance"
        extra={
          <DatePicker.RangePicker
            allowEmpty={[true, true]}
            value={[from ? dayjs(from) : null, to ? dayjs(to) : null]}
            format="D MMM YYYY"
            onChange={(range) =>
              navigate({
                from: range?.[0]?.format(DATE_PARAM_FORMAT) ?? null,
                to: range?.[1]?.format(DATE_PARAM_FORMAT) ?? null,
                page: 1,
              })
            }
          />
        }
        styles={{ body: { padding: 0 } }}
      >
        {attendanceQuery.error && !attendanceQuery.data ? (
          <div style={{ padding: 16 }}>
            <QueryErrorAlert
              error={attendanceQuery.error}
              onRetry={() => attendanceQuery.refetch()}
            />
          </div>
        ) : (
          <Image.PreviewGroup>
            <Table<TAttendanceRecord>
              rowKey="id"
              columns={columns}
              dataSource={attendanceQuery.data?.data ?? []}
              loading={attendanceQuery.isPending || attendanceQuery.isFetching}
              scroll={{ x: 560 }}
              pagination={{
                current: attendanceQuery.data?.page ?? page,
                pageSize: PAGE_SIZE,
                total: attendanceQuery.data?.total ?? 0,
                showSizeChanger: false,
                hideOnSinglePage: true,
                showTotal: (total) => `${total} record${total === 1 ? "" : "s"}`,
                onChange: (nextPage) => navigate({ page: nextPage }),
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      from || to
                        ? "No attendance in the selected dates"
                        : "No attendance recorded yet"
                    }
                  />
                ),
              }}
            />
          </Image.PreviewGroup>
        )}
      </Card>

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
