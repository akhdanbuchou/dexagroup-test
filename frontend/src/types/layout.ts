import type { ReactNode } from "react";
import type { TSessionUser } from "./user";

type TNavItem = {
  key: string;
  label: string;
  icon: ReactNode;
};

type TAppShellProps = {
  user: TSessionUser;
  children: ReactNode;
};

type TPageHeaderProps = {
  title: string;
  description?: string;
  extra?: ReactNode;
};

type TBrandMarkProps = {
  size?: "default" | "large";
};

type TQueryProviderProps = {
  children: ReactNode;
};
type TQueryErrorAlertProps = {
  error: unknown;
  onRetry: () => void;
};

export type {
  TNavItem,
  TAppShellProps,
  TPageHeaderProps,
  TBrandMarkProps,
  TQueryProviderProps,
  TQueryErrorAlertProps,
};
