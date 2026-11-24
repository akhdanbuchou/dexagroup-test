"use client";

import { Button, Flex, Result } from "antd";
import Link from "next/link";
import { useTransition } from "react";
import { logout } from "@/modules/auth";

export default function Unauthorized() {
  const [pending, startTransition] = useTransition();

  return (
    <Flex flex={1} align="center" justify="center" style={{ padding: 16 }}>
      <Result
        status="403"
        title="401 — Unauthorized"
        subTitle="Your account doesn't have access to this page."
        extra={
          <Flex gap={8} justify="center" wrap>
            <Link href="/">
              <Button type="primary">Go to my page</Button>
            </Link>
            <Button loading={pending} onClick={() => startTransition(() => logout())}>
              Sign in with another account
            </Button>
          </Flex>
        }
      />
    </Flex>
  );
}
