"use client";

import { useEffect, useRef, useState } from "react";
import type { TCameraStatus } from "../types";

const MAX_PHOTO_WIDTH = 960;
const JPEG_QUALITY = 0.85;

function statusFromError(error: unknown): TCameraStatus {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "denied";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "unavailable";
  }
  return "error";
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<TCameraStatus>("requesting");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    const video = videoRef.current;

    const open = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new DOMException("Camera API unavailable", "NotFoundError");
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stopStream(stream);
          return;
        }
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        setStatus("ready");
      } catch (error) {
        if (!cancelled) {
          setStatus(statusFromError(error));
        }
      }
    };

    void open();

    return () => {
      cancelled = true;
      stopStream(stream);
      if (video) {
        video.srcObject = null;
      }
    };
  }, [attempt]);

  const retry = () => {
    setStatus("requesting");
    setAttempt((value) => value + 1);
  };

  const capture = (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || status !== "ready" || video.videoWidth === 0) {
      return Promise.resolve(null);
    }
    const scale = Math.min(1, MAX_PHOTO_WIDTH / video.videoWidth);
    const width = Math.round(video.videoWidth * scale);
    const height = Math.round(video.videoHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return Promise.resolve(null);
    }
    context.translate(width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, width, height);

    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  };

  return { videoRef, status, retry, capture };
}

export { useCamera };
