"use client";

import { Flex, Typography } from "antd";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  extra,
}: {
  title: string;
  description?: string;
  extra?: ReactNode;
}) {
  return (
    <Flex
      justify="space-between"
      align="flex-start"
      gap={16}
      wrap
      style={{ marginBottom: 24 }}
    >
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {description && (
          <Typography.Text type="secondary">{description}</Typography.Text>
        )}
      </div>
      {extra}
    </Flex>
  );
}
