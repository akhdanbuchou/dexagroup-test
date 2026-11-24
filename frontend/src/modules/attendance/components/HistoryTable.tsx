"use client";

import { Card, DatePicker, Empty, Table, type TableProps } from "antd";
import { PageHeader } from "@/components/PageHeader";
import type { TAttendanceRow } from "../types";

const columns: TableProps<TAttendanceRow>["columns"] = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Time", dataIndex: "time", key: "time" },
  { title: "Photo", key: "photo" },
];

export function HistoryTable() {
  return (
    <>
      <PageHeader
        title="Attendance History"
        description="All of your recorded WFH clock-ins and clock-outs."
        extra={<DatePicker.RangePicker />}
      />
      <Card styles={{ body: { padding: 0 } }}>
        <Table<TAttendanceRow>
          rowKey="id"
          columns={columns}
          dataSource={[]}
          scroll={{ x: 600 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No attendance recorded yet"
              />
            ),
          }}
        />
      </Card>
    </>
  );
}
