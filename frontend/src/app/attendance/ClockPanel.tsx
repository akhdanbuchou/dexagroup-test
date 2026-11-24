"use client";

import { CameraOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Row, Tag, Timeline, Typography } from "antd";
import dayjs from "dayjs";
import { useNow } from "@/components/useNow";
import type { TClockPanelProps } from "@/types/attendance";
import { BRAND } from "@/utils/theme";

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function ClockPanel({ name }: TClockPanelProps) {
  const now = useNow();
  const firstName = name.split(" ")[0];

  return (
    <Flex vertical gap={24}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {now ? greeting(now.getHours()) : "Hello"}, {firstName}
        </Typography.Title>
        <Typography.Text type="secondary">
          Record your clock-in when you start and your clock-out when you finish working from home.
        </Typography.Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Camera">
            <Flex
              vertical
              align="center"
              justify="center"
              gap={8}
              style={{
                aspectRatio: "4 / 3",
                borderRadius: 12,
                border: `2px dashed ${BRAND.border}`,
                background: BRAND.softer,
                color: BRAND.primary,
              }}
            >
              <CameraOutlined style={{ fontSize: 40 }} />
              <Typography.Text type="secondary">
                Your camera preview will appear here
              </Typography.Text>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Flex vertical gap={24}>
            <Card>
              <Flex vertical align="center" gap={4} style={{ padding: "8px 0" }}>
                <Typography.Text type="secondary">
                  {now ? dayjs(now).format("dddd, D MMMM YYYY") : " "}
                </Typography.Text>
                <Typography.Title
                  level={1}
                  style={{
                    margin: 0,
                    fontVariantNumeric: "tabular-nums",
                    color: BRAND.primaryDark,
                  }}
                >
                  {now ? dayjs(now).format("HH:mm:ss") : "--:--:--"}
                </Typography.Title>
              </Flex>
              <Flex gap={12} style={{ marginTop: 16 }}>
                <Button type="primary" size="large" icon={<LoginOutlined />} block disabled>
                  Clock In
                </Button>
                <Button size="large" icon={<LogoutOutlined />} block disabled>
                  Clock Out
                </Button>
              </Flex>
            </Card>

            <Card title="Today">
              <Timeline
                items={[
                  {
                    color: "red",
                    content: (
                      <Flex justify="space-between">
                        <span>Clock In</span>
                        <Tag>Not yet</Tag>
                      </Flex>
                    ),
                  },
                  {
                    color: "gray",
                    content: (
                      <Flex justify="space-between">
                        <span>Clock Out</span>
                        <Tag>Not yet</Tag>
                      </Flex>
                    ),
                  },
                ]}
              />
            </Card>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
}
