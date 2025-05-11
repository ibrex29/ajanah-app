import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ValidatePasswordResetInput } from './dtos/validate-reset-password.dto';
import { ChangePasswordInput } from './dtos/change-password.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { SessionUser } from 'src/common/types/sessioon-user.type';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { LoginArgs, LoginResponse } from './types/login-response';
import { ValidateResetTokenResponse } from './types';
import { Public } from 'src/common/decorators/param-decorator/public.decorator';
import { LoginInput } from './dtos/email-login.dto';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Mutation(() => LoginResponse)
    @Public()
    async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
        const user = await this.authService.validateUser(input.email, input.password);
    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }
      return this.authService.login(input.email, input.password);
    }
    
    @Mutation(() => String)
    protectedResource() {
        return "You accessed a protected route!";
    }
    @Mutation(() => Boolean)
    async logout(@Args('token') token: string) {
        await this.authService.logout(token);
        return true;
    }

    @Mutation(() => ValidateResetTokenResponse)
    async validatePasswordResetToken(
        @Args('data') data: ValidatePasswordResetInput,
    ) {
        return this.authService.validatePasswordResetToken(data);
    }

    @Query(() => String)
    async hello() {
        return "Hello, GraphQL!";
    }


    // @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean)
    async changePassword(
        @Args('data') data: ChangePasswordInput,
        @User() user: SessionUser,
    ) {
        await this.authService.changePassword(data, user);
        return true;
    }
}
