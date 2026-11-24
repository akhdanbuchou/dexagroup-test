"use client";

import { CameraOutlined, LoadingOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import type { TCameraPreviewProps } from "../types";
import { BRAND } from "@/utils/theme";

const STATUS_COPY = {
  requesting: {
    icon: <LoadingOutlined />,
    title: "Starting your camera…",
    description: "Allow camera access when your browser asks.",
  },
  denied: {
    icon: <StopOutlined />,
    title: "Camera access is blocked",
    description:
      "Allow camera access for this site in your browser settings, then try again. A photo is required as proof of your WFH activity.",
  },
  unavailable: {
    icon: <CameraOutlined />,
    title: "No camera found",
    description: "Connect a camera or use a device with a front camera, then try again.",
  },
  error: {
    icon: <CameraOutlined />,
    title: "Couldn't start your camera",
    description: "Another app may be using it. Close it and try again.",
  },
};

export function CameraPreview({ videoRef, status, onRetry }: TCameraPreviewProps) {
  const overlay = status === "ready" ? null : STATUS_COPY[status];

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "4 / 3",
        borderRadius: 12,
        overflow: "hidden",
        background: overlay ? BRAND.softer : "#000",
        border: overlay ? `2px dashed ${BRAND.border}` : "none",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label="Camera preview"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          visibility: overlay ? "hidden" : "visible",
        }}
      />
      {overlay && (
        <Flex
          vertical
          align="center"
          justify="center"
          gap={8}
          style={{ position: "absolute", inset: 0, padding: 24, textAlign: "center" }}
        >
          <span style={{ fontSize: 36, color: BRAND.primary }}>{overlay.icon}</span>
          <Typography.Text strong>{overlay.title}</Typography.Text>
          <Typography.Text type="secondary" style={{ maxWidth: 360 }}>
            {overlay.description}
          </Typography.Text>
          {status !== "requesting" && (
            <Button onClick={onRetry} style={{ marginTop: 8 }}>
              Try again
            </Button>
          )}
        </Flex>
      )}
    </div>
  );
}
