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

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
    ) { }

    // @Mutation(() => LoginResponse)
    // @UseGuards(LocalAuthGuard) 
    // async login(
    //   @Args('email') email: string,
    //   @Args('password') password: string,
    //   @Context() context,
    // ): Promise<LoginResponse> {
    //   const user = await this.authService.validateUser(email, password);

    //   if (!user) {
    //     throw new UnauthorizedException('Invalid email or password');
    //   }

    //   const tokens = await this.authService.login(user);

    //   return {
    //     accessToken: tokens.accessToken,
    //     refreshToken: tokens.refreshToken,
    //     profile: {
    //       name: user.firstName,
    //       role: user.role,
    //     },
    //   };
    // }
    @Mutation(() => LoginResponse)
    @Public()
    async login(
        @Args() { email, password }: LoginArgs
    ) {
        try {
            const user = await this.authService.validateUser(email, password);
            return this.authService.login(user);
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
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
