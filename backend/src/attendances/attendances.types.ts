import type { AttendanceType } from '../generated/prisma/enums.js';

type TAttendanceSummary = {
  id: number;
  type: AttendanceType;
  recordedAt: string;
};

type TAttendancePhoto = {
  photo: Uint8Array;
  mimeType: string;
};

type TUploadedPhoto = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};

export type { TAttendanceSummary, TAttendancePhoto, TUploadedPhoto };
