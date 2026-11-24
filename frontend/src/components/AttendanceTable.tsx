"use client";

import {
  Card,
  DatePicker,
  Empty,
  Flex,
  Image,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import dayjs from "dayjs";
import type { TAttendanceRecord, TAttendanceTableProps } from "@/types/attendance";
import { DATE_PARAM_FORMAT, formatDate, formatTime, formatWeekday } from "@/utils/date";

export function AttendanceTable({
  result,
  loading,
  filters,
  pageSize,
  photoUrl,
  photoAlt,
  onFilterChange,
  extra,
  title = "WFH Attendance",
}: TAttendanceTableProps) {
  const hasDateFilter = Boolean(filters.from || filters.to);

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
        type === "CLOCK_IN" ? <Tag color="red">Clock In</Tag> : <Tag>Clock Out</Tag>,
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
          src={photoUrl(record)}
          alt={photoAlt(record)}
          width={72}
          height={54}
          style={{ objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
  ];

  return (
    <Card
      title={title}
      extra={
        <Flex gap={8} wrap>
          <DatePicker.RangePicker
            allowEmpty={[true, true]}
            value={[
              filters.from ? dayjs(filters.from) : null,
              filters.to ? dayjs(filters.to) : null,
            ]}
            format="D MMM YYYY"
            onChange={(range) =>
              onFilterChange({
                from: range?.[0]?.format(DATE_PARAM_FORMAT) ?? null,
                to: range?.[1]?.format(DATE_PARAM_FORMAT) ?? null,
                page: 1,
              })
            }
          />
          {extra}
        </Flex>
      }
      styles={{ body: { padding: 0 } }}
    >
      <Image.PreviewGroup>
        <Table<TAttendanceRecord>
          rowKey="id"
          columns={columns}
          dataSource={result?.data ?? []}
          loading={loading}
          scroll={{ x: 560 }}
          pagination={{
            current: result?.page ?? filters.page,
            pageSize,
            total: result?.total ?? 0,
            showSizeChanger: false,
            hideOnSinglePage: true,
            showTotal: (total) => `${total} record${total === 1 ? "" : "s"}`,
            onChange: (page) => onFilterChange({ page }),
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  hasDateFilter
                    ? "No attendance in the selected dates"
                    : "No attendance recorded yet"
                }
              />
            ),
          }}
        />
      </Image.PreviewGroup>
    </Card>
  );
}
