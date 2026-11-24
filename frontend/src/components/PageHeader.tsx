"use client";

import { Flex, Typography } from "antd";
import type { TPageHeaderProps } from "@/types/layout";

export function PageHeader({ title, description, extra }: TPageHeaderProps) {
  return (
    <Flex justify="space-between" align="flex-start" gap={16} wrap style={{ marginBottom: 24 }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {description && <Typography.Text type="secondary">{description}</Typography.Text>}
      </div>
      {extra}
    </Flex>
  );
}
