"use client";

import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { Alert, App, Button, Card, Col, Flex, Row, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import type { TAttendanceType } from "@/types/attendance";
import { APP_TIMEZONE, formatTime } from "@/utils/date";
import { errorMessage } from "@/utils/http";
import { BRAND } from "@/utils/theme";
import { useCamera, useNow, useRecordAttendance, useTodayAttendances } from "../hooks";
import type {
  TClockAvailability,
  TClockPanelProps,
  TPendingClock,
  TTodayClockState,
} from "../types";
import { CameraPreview } from "./CameraPreview";
import { ClockConfirmModal } from "./ClockConfirmModal";
import { TodayActivity } from "./TodayActivity";

const TYPE_LABEL = { CLOCK_IN: "Clock In", CLOCK_OUT: "Clock Out" };

function clockAvailability(type: TAttendanceType, state: TTodayClockState): TClockAvailability {
  if (!state.cameraReady) {
    return { allowed: false, reason: "Turn on your camera to clock in or out" };
  }
  if (state.loading) {
    return { allowed: false, reason: "Checking today's attendance…" };
  }
  if (type === "CLOCK_IN" && state.hasClockedIn) {
    return { allowed: false, reason: "You've already clocked in today" };
  }
  if (type === "CLOCK_OUT" && !state.hasClockedIn) {
    return { allowed: false, reason: "Clock in first before you clock out" };
  }
  if (type === "CLOCK_OUT" && state.hasClockedOut) {
    return { allowed: false, reason: "You've already clocked out today" };
  }
  return { allowed: true, reason: null };
}

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
  const clockState: TTodayClockState = {
    loading: today.isPending,
    hasClockedIn: records.some((record) => record.type === "CLOCK_IN"),
    hasClockedOut: records.some((record) => record.type === "CLOCK_OUT"),
    cameraReady: camera.status === "ready",
  };
  const suggested: TAttendanceType = clockState.hasClockedIn ? "CLOCK_OUT" : "CLOCK_IN";
  const doneForToday = clockState.hasClockedIn && clockState.hasClockedOut;

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
    const availability = clockAvailability(type, clockState);
    const button = (
      <Button
        type={type === suggested ? "primary" : "default"}
        size="large"
        icon={type === "CLOCK_IN" ? <LoginOutlined /> : <LogoutOutlined />}
        block
        disabled={!availability.allowed || recordMutation.isPending}
        loading={capturing && pending === null}
        onClick={() => startClock(type)}
      >
        {TYPE_LABEL[type]}
      </Button>
    );
    return availability.allowed ? (
      button
    ) : (
      <Tooltip title={availability.reason}>
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
              {doneForToday && (
                <Alert
                  type="success"
                  showIcon
                  title="You're done for today"
                  description="Your clock-in and clock-out are recorded. See you tomorrow!"
                  style={{ marginTop: 16 }}
                />
              )}
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
