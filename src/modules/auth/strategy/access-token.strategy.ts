import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from 'src/common/token/jwt-token.service';
import { JWT_ACCESS_SECRET } from 'src/common/constants';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAccessTokenStrategy extends PassportStrategy(Strategy, 'gql-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {
    super({
      jwtFromRequest: (request: any) => request, // We handle extraction manually in `validate()`
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow(JWT_ACCESS_SECRET),
    });
  }

  private extractJwtFromContext(context: ExecutionContext): string | null {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (request?.headers?.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
    }

    if (request?.cookies?.accessToken) {
      return request.cookies.accessToken;
    }

    return null;
  }

  async validate(payload: any, request: any) {
    try {
      const token = this.extractJwtFromContext(request);
  
      console.log("Extracted Token:", token);
  
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
  
      if (await this.jwtTokenService.isBlacklisted(token)) {
        throw new UnauthorizedException('Session expired');
      }
  
      console.log("Decoded Payload:", payload);
  
      return {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      console.error("JWT Validation Error:", error);
      throw new UnauthorizedException('Invalid token');
    }
  }
  
}
