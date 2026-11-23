import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import type { TJwtPayload } from './auth.types.js';

type TLoginResult = {
  accessToken: string;
  user: Omit<TJwtPayload, 'sub'> & { id: number };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<TLoginResult> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { employee: { select: { name: true } } },
    });

    const passwordMatches =
      user !== null && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload: TJwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      employeeId: user.employeeId,
      name: user.employee?.name ?? user.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
        employeeId: payload.employeeId,
        name: payload.name,
      },
    };
  }
}

export type { TLoginResult };
