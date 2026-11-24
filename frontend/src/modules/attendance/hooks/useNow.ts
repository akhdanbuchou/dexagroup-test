"use client";

import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

function currentSecond() {
  return Math.floor(Date.now() / 1000);
}

export function useNow(): Date | null {
  const second = useSyncExternalStore(subscribe, currentSecond, () => null);
  return second === null ? null : new Date(second * 1000);
}
