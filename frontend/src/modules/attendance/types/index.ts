import type { TAttendanceType } from "@/types/attendance";

type TAttendanceRow = {
  id: number;
  date: string;
  type: TAttendanceType;
  time: string;
};

type TClockPanelProps = {
  name: string;
};

export type { TAttendanceRow, TClockPanelProps };
