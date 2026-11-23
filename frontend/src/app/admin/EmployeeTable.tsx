"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Flex, Input, Table, type TableProps } from "antd";
import { PageHeader } from "@/components/PageHeader";
import type { TEmployeeRow } from "@/types/employee";


const columns: TableProps<TEmployeeRow>["columns"] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Position", dataIndex: "position", key: "position" },
  { title: "Date of Birth", dataIndex: "dateOfBirth", key: "dateOfBirth" },
  { title: "Age", dataIndex: "age", key: "age", width: 90 },
  { title: "Actions", key: "actions", width: 160 },
];

export function EmployeeTable() {
  return (
    <>
      <PageHeader
        title="Employees"
        description="Manage employee data and review their WFH attendance."
        extra={
          <Button type="primary" icon={<PlusOutlined />} disabled>
            Add Employee
          </Button>
        }
      />
      <Card styles={{ body: { padding: 0 } }}>
        <Flex style={{ padding: 16 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name or position"
            allowClear
            style={{ maxWidth: 320 }}
          />
        </Flex>
        <Table<TEmployeeRow>
          rowKey="id"
          columns={columns}
          dataSource={[]}
          scroll={{ x: 700 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No employees to show yet"
              />
            ),
          }}
        />
      </Card>
    </>
  );
}
