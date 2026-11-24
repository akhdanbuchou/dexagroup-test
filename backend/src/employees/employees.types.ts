import type { AttendanceType } from '../generated/prisma/enums.js';

type TEmployeeSummary = {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  age: number;
  username: string | null;
};

type TEmployeeDetail = TEmployeeSummary & {
  attendanceCount: number;
  createdAt: string;
  updatedAt: string;
};

type TAttendanceSummary = {
  id: number;
  type: AttendanceType;
  recordedAt: string;
};

type TAttendancePhoto = {
  photo: Uint8Array;
  mimeType: string;
};

export type {
  TEmployeeSummary,
  TEmployeeDetail,
  TAttendanceSummary,
  TAttendancePhoto,
};
