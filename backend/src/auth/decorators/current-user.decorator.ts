import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TAuthenticatedRequest, TJwtPayload } from '../auth.types.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TJwtPayload | undefined =>
    ctx.switchToHttp().getRequest<TAuthenticatedRequest>().user,
);
