"use client";

import { LaptopOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { BRAND } from "@/utils/theme";
import type { TBrandMarkProps } from "@/types/layout";

export function BrandMark({ size = "default" }: TBrandMarkProps) {
  const large = size === "large";
  return (
    <Flex align="center" gap={large ? 12 : 10}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: large ? 48 : 36,
          height: large ? 48 : 36,
          borderRadius: large ? 14 : 10,
          background: BRAND.soft,
          color: BRAND.primary,
          fontSize: large ? 24 : 18,
        }}
      >
        <LaptopOutlined />
      </Flex>
      <Typography.Text strong style={{ fontSize: large ? 20 : 16 }}>
        WFH Attendance
      </Typography.Text>
    </Flex>
  );
}
