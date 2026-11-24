"use client";

import { Button, Flex, Result } from "antd";
import Link from "next/link";

export function EmployeeNotFound() {
  return (
    <Flex justify="center" style={{ padding: "48px 0" }}>
      <Result
        status="404"
        title="Employee not found"
        subTitle="This employee doesn't exist or may have been removed."
        extra={
          <Link href="/admin">
            <Button type="primary">Back to employees</Button>
          </Link>
        }
      />
    </Flex>
  );
}
