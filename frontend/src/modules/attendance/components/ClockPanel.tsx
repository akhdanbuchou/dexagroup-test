"use client";

import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { App, Button, Card, Col, Flex, Row, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import type { TAttendanceType } from "@/types/attendance";
import { APP_TIMEZONE, formatTime } from "@/utils/date";
import { errorMessage } from "@/utils/http";
import { BRAND } from "@/utils/theme";
import { useCamera, useNow, useRecordAttendance, useTodayAttendances } from "../hooks";
import type { TClockPanelProps, TPendingClock } from "../types";
import { CameraPreview } from "./CameraPreview";
import { ClockConfirmModal } from "./ClockConfirmModal";
import { TodayActivity } from "./TodayActivity";

const TYPE_LABEL = { CLOCK_IN: "Clock In", CLOCK_OUT: "Clock Out" };

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function ClockPanel({ name }: TClockPanelProps) {
  const { message } = App.useApp();
  const now = useNow();
  const camera = useCamera();
  const today = useTodayAttendances();
  const recordMutation = useRecordAttendance();
  const [pending, setPending] = useState<TPendingClock>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  const firstName = name.split(" ")[0];
  const local = now ? dayjs(now).tz(APP_TIMEZONE) : null;
  const records = today.data?.data ?? [];
  const suggested: TAttendanceType = records[0]?.type === "CLOCK_IN" ? "CLOCK_OUT" : "CLOCK_IN";
  const cameraReady = camera.status === "ready";

  const startClock = async (type: TAttendanceType) => {
    setCapturing(true);
    const blob = await camera.capture();
    setCapturing(false);
    if (!blob) {
      message.error("Couldn't take a photo. Make sure your camera is on and try again.");
      return;
    }
    setSubmitError(null);
    setPending({ type, photo: { blob, url: URL.createObjectURL(blob) } });
  };

  const closeConfirm = () => {
    setPending(null);
    setSubmitError(null);
  };

  const confirm = () => {
    if (!pending) return;
    recordMutation.mutate(
      { type: pending.type, photo: pending.photo.blob },
      {
        onSuccess: (record) => {
          message.success(
            `${TYPE_LABEL[record.type]} recorded at ${formatTime(record.recordedAt)} WIB`,
          );
          closeConfirm();
        },
        onError: (error) => setSubmitError(errorMessage(error)),
      },
    );
  };

  const clockButton = (type: TAttendanceType) => {
    const button = (
      <Button
        type={type === suggested ? "primary" : "default"}
        size="large"
        icon={type === "CLOCK_IN" ? <LoginOutlined /> : <LogoutOutlined />}
        block
        disabled={!cameraReady || recordMutation.isPending}
        loading={capturing && pending === null}
        onClick={() => startClock(type)}
      >
        {TYPE_LABEL[type]}
      </Button>
    );
    return cameraReady ? (
      button
    ) : (
      <Tooltip title="Turn on your camera to clock in or out">
        <span style={{ flex: 1 }}>{button}</span>
      </Tooltip>
    );
  };

  return (
    <Flex vertical gap={24}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {local ? greeting(local.hour()) : "Hello"}, {firstName}
        </Typography.Title>
        <Typography.Text type="secondary">
          Take a photo with your camera to record your clock-in when you start and your clock-out
          when you finish working from home.
        </Typography.Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Camera">
            <CameraPreview
              videoRef={camera.videoRef}
              status={camera.status}
              onRetry={camera.retry}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Flex vertical gap={24}>
            <Card>
              <Flex vertical align="center" gap={4} style={{ padding: "8px 0" }}>
                <Typography.Text type="secondary">
                  {local ? local.format("dddd, D MMMM YYYY") : " "}
                </Typography.Text>
                <Typography.Title
                  level={1}
                  style={{
                    margin: 0,
                    fontVariantNumeric: "tabular-nums",
                    color: BRAND.primaryDark,
                  }}
                >
                  {local ? local.format("HH:mm:ss") : "--:--:--"}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Western Indonesia Time (WIB)
                </Typography.Text>
              </Flex>
              <Flex gap={12} style={{ marginTop: 16 }}>
                {clockButton("CLOCK_IN")}
                {clockButton("CLOCK_OUT")}
              </Flex>
            </Card>

            <TodayActivity
              records={records}
              loading={today.isPending}
              error={today.error}
              onRetry={() => today.refetch()}
            />
          </Flex>
        </Col>
      </Row>

      <ClockConfirmModal
        pending={pending}
        submitting={recordMutation.isPending}
        error={submitError}
        onConfirm={confirm}
        onCancel={closeConfirm}
      />
    </Flex>
  );
}
