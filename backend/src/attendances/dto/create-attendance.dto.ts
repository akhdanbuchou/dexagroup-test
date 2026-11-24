import { IsEnum } from 'class-validator';
import { AttendanceType } from '../../generated/prisma/enums.js';

export class CreateAttendanceDto {
  @IsEnum(AttendanceType)
  type: AttendanceType;
}
