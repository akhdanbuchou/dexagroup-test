type TAttendanceType = "CLOCK_IN" | "CLOCK_OUT";

type TAttendanceRecord = {
  id: number;
  type: TAttendanceType;
  recordedAt: string;
};

export type { TAttendanceType, TAttendanceRecord };
