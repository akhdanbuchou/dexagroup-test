"use client";

import { Alert, Flex, Image, Modal, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNow } from "../hooks/useNow";
import type { TClockConfirmModalProps } from "../types";
import { APP_TIMEZONE } from "@/utils/date";

const TYPE_LABEL = { CLOCK_IN: "Clock In", CLOCK_OUT: "Clock Out" };

export function ClockConfirmModal({
  pending,
  submitting,
  error,
  onConfirm,
  onCancel,
}: TClockConfirmModalProps) {
  const now = useNow();
  const photoUrl = pending?.photo.url;

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const label = pending ? TYPE_LABEL[pending.type] : "";

  return (
    <Modal
      open={pending !== null}
      title={`Confirm ${label}`}
      okText={`Confirm ${label}`}
      cancelText="Retake"
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={submitting}
      mask={{ closable: !submitting }}
      cancelButtonProps={{ disabled: submitting }}
    >
      <Flex vertical gap={16}>
        {error && <Alert type="error" showIcon title={error} />}
        {photoUrl && (
          <Image
            src={photoUrl}
            alt={`${label} photo`}
            preview={false}
            style={{ width: "100%", borderRadius: 12 }}
          />
        )}
        <Flex vertical gap={2}>
          <Typography.Text type="secondary">Current time</Typography.Text>
          <Typography.Text strong style={{ fontSize: 18, fontVariantNumeric: "tabular-nums" }}>
            {now ? dayjs(now).tz(APP_TIMEZONE).format("dddd, D MMM YYYY · HH:mm:ss") : "—"} WIB
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            The exact time is set by the server when you confirm.
          </Typography.Text>
        </Flex>
      </Flex>
    </Modal>
  );
}
