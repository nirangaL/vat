import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser as CurrentUserInterface } from '@shared/core';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserInterface => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
