import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceType } from '../generated/prisma/enums.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { workDateFor } from '../common/date.util.js';
import type { TPaginated } from '../common/pagination.types.js';
import { detectImageMimeType } from '../common/photo.util.js';
import { ListAttendancesQueryDto } from './dto/list-attendances-query.dto.js';
import type {
  TAttendancePhoto,
  TAttendanceSummary,
  TUploadedPhoto,
} from './attendances.types.js';

const summarySelect = {
  id: true,
  type: true,
  recordedAt: true,
} satisfies Prisma.AttendanceSelect;

type TAttendanceRow = Prisma.AttendanceGetPayload<{
  select: typeof summarySelect;
}>;

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  async record(
    employeeId: number,
    type: AttendanceType,
    photo: TUploadedPhoto | undefined,
  ): Promise<TAttendanceSummary> {
    if (!photo || photo.size === 0) {
      throw new BadRequestException('photo is required');
    }
    const mimeType = detectImageMimeType(photo.buffer);
    if (!mimeType) {
      throw new BadRequestException('photo must be a JPEG, PNG or WebP image');
    }

    const recordedAt = new Date();
    const workDate = workDateFor(recordedAt);

    if (type === AttendanceType.CLOCK_OUT) {
      const clockedIn = await this.prisma.attendance.count({
        where: { employeeId, workDate, type: AttendanceType.CLOCK_IN },
      });
      if (clockedIn === 0) {
        throw new ConflictException(
          'You need to clock in today before you can clock out',
        );
      }
    }

    try {
      const row = await this.prisma.attendance.create({
        data: {
          employeeId,
          type,
          recordedAt,
          workDate,
          photo: new Uint8Array(photo.buffer),
          photoMimeType: mimeType,
        },
        select: summarySelect,
      });
      return this.toSummary(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          type === AttendanceType.CLOCK_IN
            ? 'You have already clocked in today'
            : 'You have already clocked out today',
        );
      }
      throw error;
    }
  }

  async listForEmployee(
    employeeId: number,
    query: ListAttendancesQueryDto,
  ): Promise<TPaginated<TAttendanceSummary>> {
    const where: Prisma.AttendanceWhereInput = {
      employeeId,
      recordedAt: {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      },
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        select: summarySelect,
        orderBy: [{ recordedAt: 'desc' }, { id: 'desc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    return {
      data: rows.map((row) => this.toSummary(row)),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async getPhoto(
    employeeId: number,
    attendanceId: number,
  ): Promise<TAttendancePhoto> {
    const row = await this.prisma.attendance.findFirst({
      where: { id: attendanceId, employeeId },
      select: { photo: true, photoMimeType: true },
    });
    if (!row) {
      throw new NotFoundException(`Attendance ${attendanceId} not found`);
    }
    return { photo: row.photo, mimeType: row.photoMimeType };
  }

  private toSummary(row: TAttendanceRow): TAttendanceSummary {
    return {
      id: row.id,
      type: row.type,
      recordedAt: row.recordedAt.toISOString(),
    };
  }
}
