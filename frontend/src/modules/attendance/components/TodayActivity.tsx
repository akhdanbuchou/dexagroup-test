"use client";

import { Card, Empty, Flex, Skeleton, Tag, Timeline, Typography } from "antd";
import { QueryErrorAlert } from "@/components/QueryErrorAlert";
import type { TTodayActivityProps } from "../types";
import { formatTime } from "@/utils/date";

export function TodayActivity({ records, loading, error, onRetry }: TTodayActivityProps) {
  const chronological = [...records].reverse();
  const clockIn = records.find((record) => record.type === "CLOCK_IN");
  const clockOut = records.find((record) => record.type === "CLOCK_OUT");

  return (
    <Card title="Today">
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : error ? (
        <QueryErrorAlert error={error} onRetry={onRetry} />
      ) : records.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You haven't clocked in today" />
      ) : (
        <Flex vertical gap={16}>
          <Flex gap={24}>
            <Flex vertical>
              <Typography.Text type="secondary">Clock in</Typography.Text>
              <Typography.Text strong style={{ fontSize: 18 }}>
                {clockIn ? formatTime(clockIn.recordedAt) : "—"}
              </Typography.Text>
            </Flex>
            <Flex vertical>
              <Typography.Text type="secondary">Clock out</Typography.Text>
              <Typography.Text strong style={{ fontSize: 18 }}>
                {clockOut ? formatTime(clockOut.recordedAt) : "—"}
              </Typography.Text>
            </Flex>
          </Flex>
          <Timeline
            items={chronological.map((record) => ({
              key: record.id,
              color: record.type === "CLOCK_IN" ? "red" : "gray",
              content: (
                <Flex justify="space-between" gap={8}>
                  <Typography.Text style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatTime(record.recordedAt)} WIB
                  </Typography.Text>
                  {record.type === "CLOCK_IN" ? (
                    <Tag color="red">Clock In</Tag>
                  ) : (
                    <Tag>Clock Out</Tag>
                  )}
                </Flex>
              ),
            }))}
          />
        </Flex>
      )}
    </Card>
  );
}
