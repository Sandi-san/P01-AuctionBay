import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//namesto uporabe @Req Request v user.controller, vrni User objekt
export const GetLoggedUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) return request.user[data];
    return request.user;
    //user iz jwt.strategy
  },
);
