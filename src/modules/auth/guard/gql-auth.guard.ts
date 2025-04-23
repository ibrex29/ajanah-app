import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from 'src/common/decorators/param-decorator/public.decorator';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('isPublic:', isPublic);

    if (isPublic) {
      return true;
    }

    // Handle GraphQL context transformation
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();

    // Ensure request object exists
    if (!ctx.req) {
      ctx.req = {};
    }


  console.log('Context req:', ctx.req ? 'Exists' : 'Undefined');


    return super.canActivate(
      new Proxy(context, {
        get: (target, prop) => (prop === 'getContext' ? () => ctx : target[prop]),
      })
    ) as Promise<boolean>;
  }

  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    console.log('Extracted Request:', request ? 'Exists' : 'Undefined');
    return request;
  }
  
}