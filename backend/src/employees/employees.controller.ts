import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AttendancesService } from '../attendances/attendances.service.js';
import { ListAttendancesQueryDto } from '../attendances/dto/list-attendances-query.dto.js';
import { PHOTO_RESPONSE_HEADERS } from '../common/photo.util.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { EmployeesService } from './employees.service.js';

@Roles(Role.HR_ADMIN)
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employees: EmployeesService,
    private readonly attendances: AttendancesService,
  ) {}

  @Get()
  list(@Query() query: ListEmployeesQueryDto) {
    return this.employees.list(query);
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employees.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employees.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employees.update(id, dto);
  }

  @Get(':id/attendances')
  async listAttendances(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListAttendancesQueryDto,
  ) {
    await this.employees.assertExists(id);
    return this.attendances.listForEmployee(id, query);
  }

  @Get(':id/attendances/:attendanceId/photo')
  async getAttendancePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('attendanceId', ParseIntPipe) attendanceId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { photo, mimeType } = await this.attendances.getPhoto(
      id,
      attendanceId,
    );
    res.set(PHOTO_RESPONSE_HEADERS);
    return new StreamableFile(photo, { type: mimeType });
  }
}
