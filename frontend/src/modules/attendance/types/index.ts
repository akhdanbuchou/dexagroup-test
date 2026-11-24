import type { RefObject } from "react";
import type { TAttendanceRecord, TAttendanceType } from "@/types/attendance";

type TCameraStatus = "requesting" | "ready" | "denied" | "unavailable" | "error";

type TCapturedPhoto = {
  blob: Blob;
  url: string;
};

type TPendingClock = {
  type: TAttendanceType;
  photo: TCapturedPhoto;
} | null;

type TRecordAttendanceInput = {
  type: TAttendanceType;
  photo: Blob;
};

type TTodayClockState = {
  loading: boolean;
  hasClockedIn: boolean;
  hasClockedOut: boolean;
  cameraReady: boolean;
};

type TClockAvailability = {
  allowed: boolean;
  reason: string | null;
};

type TClockPanelProps = {
  name: string;
};

type TCameraPreviewProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: TCameraStatus;
  onRetry: () => void;
};

type TClockConfirmModalProps = {
  pending: TPendingClock;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

type TTodayActivityProps = {
  records: TAttendanceRecord[];
  loading: boolean;
  error: unknown;
  onRetry: () => void;
};

export type {
  TCameraStatus,
  TCapturedPhoto,
  TPendingClock,
  TRecordAttendanceInput,
  TTodayClockState,
  TClockAvailability,
  TClockPanelProps,
  TCameraPreviewProps,
  TClockConfirmModalProps,
  TTodayActivityProps,
};
