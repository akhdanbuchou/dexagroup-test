import type { ReactNode } from "react";
import type { TPaginated } from "./api";

type TAttendanceType = "CLOCK_IN" | "CLOCK_OUT";

type TAttendanceRecord = {
  id: number;
  type: TAttendanceType;
  recordedAt: string;
};

type TAttendanceListParams = {
  from: string | null;
  to: string | null;
  page: number;
  pageSize: number;
};

type TAttendanceList = TPaginated<TAttendanceRecord>;

type TAttendanceFilters = {
  from: string | null;
  to: string | null;
  page: number;
};

type TAttendanceFilterQuery = {
  from?: string | null;
  to?: string | null;
  page?: number;
};

type TAttendanceTableProps = {
  result: TAttendanceList | undefined;
  loading: boolean;
  filters: TAttendanceFilters;
  pageSize: number;
  photoUrl: (record: TAttendanceRecord) => string;
  photoAlt: (record: TAttendanceRecord) => string;
  onFilterChange: (query: TAttendanceFilterQuery) => void;
  extra?: ReactNode;
  title?: string;
};

export type {
  TAttendanceType,
  TAttendanceRecord,
  TAttendanceListParams,
  TAttendanceList,
  TAttendanceFilters,
  TAttendanceFilterQuery,
  TAttendanceTableProps,
};
