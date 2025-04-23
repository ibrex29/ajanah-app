import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from './password.service';
import { UserModule } from '../user/user.module';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtTokenService } from 'src/common/token/jwt-token.service';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { GqlAccessTokenStrategy } from './strategy/access-token.strategy';

@Module({
  imports: [PassportModule, UserModule],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshTokenStrategy,
    JwtTokenService,
    PasswordService,
    AuthResolver,
    GqlAccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard, // Apply the global auth guard
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
