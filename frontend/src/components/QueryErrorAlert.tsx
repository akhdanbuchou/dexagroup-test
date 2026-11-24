"use client";

import { Alert, Button } from "antd";
import type { TQueryErrorAlertProps } from "@/types/layout";
import { errorMessage } from "@/utils/http";

export function QueryErrorAlert({ error, onRetry }: TQueryErrorAlertProps) {
  return (
    <Alert
      type="error"
      showIcon
      title="Couldn't load data"
      description={errorMessage(error)}
      action={
        <Button size="small" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}
