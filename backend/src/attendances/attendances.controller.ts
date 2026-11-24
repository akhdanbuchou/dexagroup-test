import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { Role } from '../generated/prisma/enums.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { TJwtPayload } from '../auth/auth.types.js';
import {
  MAX_PHOTO_BYTES,
  PHOTO_RESPONSE_HEADERS,
} from '../common/photo.util.js';
import { AttendancesService } from './attendances.service.js';
import type { TUploadedPhoto } from './attendances.types.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { ListAttendancesQueryDto } from './dto/list-attendances-query.dto.js';

@Roles(Role.EMPLOYEE)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendances: AttendancesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: MAX_PHOTO_BYTES, files: 1 },
    }),
  )
  record(
    @CurrentUser() user: TJwtPayload,
    @Body() dto: CreateAttendanceDto,
    @UploadedFile() photo: TUploadedPhoto | undefined,
  ) {
    return this.attendances.record(this.employeeIdOf(user), dto.type, photo);
  }

  @Get('me')
  listMine(
    @CurrentUser() user: TJwtPayload,
    @Query() query: ListAttendancesQueryDto,
  ) {
    return this.attendances.listForEmployee(this.employeeIdOf(user), query);
  }

  @Get('me/:attendanceId/photo')
  async getMyPhoto(
    @CurrentUser() user: TJwtPayload,
    @Param('attendanceId', ParseIntPipe) attendanceId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { photo, mimeType } = await this.attendances.getPhoto(
      this.employeeIdOf(user),
      attendanceId,
    );
    res.set(PHOTO_RESPONSE_HEADERS);
    return new StreamableFile(photo, { type: mimeType });
  }

  private employeeIdOf(user: TJwtPayload): number {
    if (user.employeeId === null) {
      throw new ForbiddenException('Your account has no employee profile');
    }
    return user.employeeId;
  }
}
