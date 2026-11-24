"use client";

import { EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Space,
  Table,
  Typography,
  type TableProps,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorAlert } from "@/components/QueryErrorAlert";
import { useEmployees } from "../hooks";
import type { TEmployee, TEmployeeListQuery, TEmployeeModalState } from "../types";
import { formatDateOnly } from "@/utils/date";
import { EmployeeFormModal } from "./EmployeeFormModal";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 350;

export function EmployeeTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

  const search = (searchParams.get("search") ?? "").trim();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "", 10) || 1);

  const [searchText, setSearchText] = useState(search);
  const [modal, setModal] = useState<TEmployeeModalState>(null);
  const { data, error, isPending, isFetching, refetch } = useEmployees({
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const navigate = (params: TEmployeeListQuery) => {
    const next = new URLSearchParams();
    const nextSearch = params.search ?? search;
    const nextPage = params.page ?? 1;
    if (nextSearch) next.set("search", nextSearch);
    if (nextPage > 1) next.set("page", String(nextPage));
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => {
    const trimmed = searchText.trim();
    if (trimmed === search) {
      return;
    }
    const id = setTimeout(() => navigate({ search: trimmed, page: 1 }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  });

  const columns: TableProps<TEmployee>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, employee) => (
        <Flex vertical>
          <Link href={`/admin/employees/${employee.id}`}>
            <Typography.Text strong>{name}</Typography.Text>
          </Link>
          {employee.username && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              @{employee.username}
            </Typography.Text>
          )}
        </Flex>
      ),
    },
    { title: "Position", dataIndex: "position", key: "position" },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (value: string) => formatDateOnly(value),
    },
    { title: "Age", dataIndex: "age", key: "age", width: 80 },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, employee) => (
        <Space size={4}>
          <Link href={`/admin/employees/${employee.id}`}>
            <Button type="text" size="small" icon={<EyeOutlined />}>
              View
            </Button>
          </Link>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setModal({ mode: "edit", employee })}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Employees"
        description="Manage employee data and review their WFH attendance."
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModal({ mode: "create" })}
          >
            Add Employee
          </Button>
        }
      />
      {error && !data && (
        <div style={{ marginBottom: 16 }}>
          <QueryErrorAlert error={error} onRetry={() => refetch()} />
        </div>
      )}
      <Card styles={{ body: { padding: 0 } }}>
        <Flex style={{ padding: 16 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, position or username"
            allowClear
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            style={{ maxWidth: 360 }}
          />
        </Flex>
        <Table<TEmployee>
          rowKey="id"
          columns={columns}
          dataSource={data?.data ?? []}
          loading={isPending || isFetching}
          scroll={{ x: 760 }}
          pagination={{
            current: data?.page ?? page,
            pageSize: PAGE_SIZE,
            total: data?.total ?? 0,
            showSizeChanger: false,
            hideOnSinglePage: true,
            showTotal: (total) => `${total} employee${total === 1 ? "" : "s"}`,
            onChange: (nextPage) => navigate({ page: nextPage }),
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={search ? `No employees match "${search}"` : "No employees yet"}
              />
            ),
          }}
        />
      </Card>
      <EmployeeFormModal
        open={modal !== null}
        mode={modal?.mode ?? "create"}
        employee={modal?.employee}
        onClose={() => setModal(null)}
        onSaved={(employee) => {
          message.success(
            modal?.mode === "create"
              ? `${employee.name} has been added`
              : `${employee.name} has been updated`,
          );
          setModal(null);
        }}
      />
    </>
  );
}
