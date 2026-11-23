"use client";

import { Button, Card, Flex, Typography } from "antd";

export default function Home() {
  return (
    <Flex flex={1} align="center" justify="center" style={{ padding: 16 }}>
      <Card style={{ width: "100%", maxWidth: 420 }}>
        <Typography.Title level={3}>WFH Attendance</Typography.Title>
        <Typography.Paragraph type="secondary">
          Manage employee data and record work-from-home attendance.
        </Typography.Paragraph>
        <Flex gap={8}>
          <Button type="primary">HRD Admin</Button>
          <Button>Employee</Button>
        </Flex>
      </Card>
    </Flex>
  );
}
