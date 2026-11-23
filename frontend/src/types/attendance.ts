type TAttendanceType = "CLOCK_IN" | "CLOCK_OUT";

type TAttendanceRow = {
  id: number;
  date: string;
  type: TAttendanceType;
  time: string;
};

type TClockPanelProps = {
  name: string;
};

export type { TAttendanceType, TAttendanceRow, TClockPanelProps };
