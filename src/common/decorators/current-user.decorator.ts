import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from 'src/common/interfaces/jwt-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as JwtUser | undefined;

    if (!user) {
      return undefined;
    }

    return data ? user[data] : user;
  },
);
