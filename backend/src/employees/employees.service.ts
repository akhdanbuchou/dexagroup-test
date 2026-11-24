import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Prisma, Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { calculateAge, toDateOnly } from '../common/date.util.js';
import type { TPaginated } from '../common/pagination.types.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { ListAttendancesQueryDto } from './dto/list-attendances-query.dto.js';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import type {
  TAttendancePhoto,
  TAttendanceSummary,
  TEmployeeDetail,
  TEmployeeSummary,
} from './employees.types.js';

const employeeWithUsername = {
  include: { user: { select: { username: true } } },
} satisfies Prisma.EmployeeDefaultArgs;

type TEmployeeRecord = Prisma.EmployeeGetPayload<typeof employeeWithUsername>;

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    query: ListEmployeesQueryDto,
  ): Promise<TPaginated<TEmployeeSummary>> {
    const search = query.search?.trim();
    const where: Prisma.EmployeeWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { position: { contains: search, mode: 'insensitive' } },
            { user: { username: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        ...employeeWithUsername,
        where,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
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

  async findOne(id: number): Promise<TEmployeeDetail> {
    const row = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
        _count: { select: { attendances: true } },
      },
    });
    if (!row) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return {
      ...this.toSummary(row),
      attendanceCount: row._count.attendances,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async create(dto: CreateEmployeeDto): Promise<TEmployeeDetail> {
    const dateOfBirth = this.parseDateOfBirth(dto.dateOfBirth);
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const row = await this.prisma.employee.create({
        data: {
          name: dto.name.trim(),
          dateOfBirth,
          position: dto.position.trim(),
          user: {
            create: {
              username: dto.username,
              passwordHash,
              role: Role.EMPLOYEE,
            },
          },
        },
      });
      return this.findOne(row.id);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Username is already taken');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<TEmployeeDetail> {
    const data: Prisma.EmployeeUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.position !== undefined) data.position = dto.position.trim();
    if (dto.dateOfBirth !== undefined) {
      data.dateOfBirth = this.parseDateOfBirth(dto.dateOfBirth);
    }

    try {
      await this.prisma.employee.update({ where: { id }, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Employee ${id} not found`);
      }
      throw error;
    }
    return this.findOne(id);
  }

  async listAttendances(
    employeeId: number,
    query: ListAttendancesQueryDto,
  ): Promise<TPaginated<TAttendanceSummary>> {
    await this.ensureExists(employeeId);

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
        select: { id: true, type: true, recordedAt: true },
        orderBy: [{ recordedAt: 'desc' }, { id: 'desc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    return {
      data: rows.map((row) => ({
        id: row.id,
        type: row.type,
        recordedAt: row.recordedAt.toISOString(),
      })),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async getAttendancePhoto(
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

  private async ensureExists(id: number): Promise<void> {
    const exists = await this.prisma.employee.count({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
  }

  private parseDateOfBirth(value: string): Date {
    const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.getTime() > Date.now()) {
      throw new BadRequestException(
        'dateOfBirth must be a valid date in the past',
      );
    }
    return date;
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }

  private toSummary(row: TEmployeeRecord): TEmployeeSummary {
    return {
      id: row.id,
      name: row.name,
      position: row.position,
      dateOfBirth: toDateOnly(row.dateOfBirth),
      age: calculateAge(row.dateOfBirth),
      username: row.user?.username ?? null,
    };
  }
}
