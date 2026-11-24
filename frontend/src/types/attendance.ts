type TAttendanceType = "CLOCK_IN" | "CLOCK_OUT";

type TAttendanceRow = {
  id: number;
  date: string;
  type: TAttendanceType;
  time: string;
};

type TAttendanceRecord = {
  id: number;
  type: TAttendanceType;
  recordedAt: string;
};

type TClockPanelProps = {
  name: string;
};

export type { TAttendanceType, TAttendanceRow, TAttendanceRecord, TClockPanelProps };
