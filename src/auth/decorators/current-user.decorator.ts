import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    if (ctx.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(ctx).getContext().req.user;
    }
    return ctx.switchToHttp().getRequest().user;
  },
);
