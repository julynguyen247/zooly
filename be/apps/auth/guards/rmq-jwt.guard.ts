import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class RmqJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rmqCtx = context.switchToRpc().getContext<RmqContext>();
    const msg = rmqCtx.getMessage();
    const headers = (msg?.properties?.headers || {}) as Record<string, any>;

    const auth = headers['Authorization'] || headers['authorization'];
    if (!auth) throw new RpcException('Missing Authorization header');
    const token = String(auth).split(' ')[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!);

      const data = context.switchToRpc().getData() as any;
      data.__user = user;

      return true;
    } catch {
      throw new RpcException('Invalid or expired token');
    }
  }
}
