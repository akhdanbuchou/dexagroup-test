"use client";

import { Card, Flex, Typography } from "antd";
import { BrandMark } from "@/components/BrandMark";
import { BRAND } from "@/lib/theme";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Flex
      flex={1}
      align="center"
      justify="center"
      style={{
        padding: 16,
        background: `radial-gradient(circle at top, ${BRAND.soft} 0%, #ffffff 70%)`,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 400 }} styles={{ body: { padding: 32 } }}>
        <Flex vertical gap={24}>
          <Flex vertical gap={8}>
            <BrandMark size="large" />
            <Typography.Text type="secondary">
              Sign in to clock in your work-from-home attendance or manage
              employees.
            </Typography.Text>
          </Flex>
          <LoginForm />
        </Flex>
      </Card>
    </Flex>
  );
}
