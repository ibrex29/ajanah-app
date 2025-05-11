import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { JwtTokenService } from 'src/common/token/jwt-token.service';
import { SessionUser } from 'src/common/types/sessioon-user.type';
import { UserService } from '../user/user.service';
import { ValidatePasswordResetInput } from './dtos/validate-reset-password.dto';
import { ChangePasswordInput } from './dtos/change-password.dto';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
  code: string;
  profile: {
    sub: string;
    email: string;
    role: string;
    name?: string;
  };
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtTokenService,
    private cryptoService: CryptoService,
    private passwordService: PasswordService,
  ) { }

  validateApiKey(apiKey: string) {
    const apiKeys: string[] = ['api-key-1', 'api-key-2'];
    return apiKeys.find((key) => apiKey === key);
  }

  async validateUser(email: string, inputtedPassword: string) {
    const user = await this.userService.findUserByEmail(email);
  
    if (!user) {
      return {
        success: false,
        message: 'No account found with this email',
        code: 'NOT_FOUND',
      };
    }
  
    const isMatch = await this.cryptoService.comparePassword(
      inputtedPassword,
      user.password,
    );
  
    if (!isMatch) {
      return {
        success: false,
        message: 'Incorrect password',
        code: 'UNAUTHORIZED',
      };
    }
  
    const { password, ...result } = user;
    return { success: true, user: result };
  }
  
  async login(email: string, password: string): Promise<LoginResponse> {
    const result = await this.validateUser(email, password);
  
    if (!result.success) {
      return {
        accessToken: null,
        refreshToken: null,
        message: result.message,
        code: result.code,
        profile: null,
      };
    }
  
    const user = result.user;
  
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  
    const tokens = await this.jwtTokenService.generateToken(payload);
  
    return {
      ...tokens,
      message: 'Login successful',
      code: 'SUCCESS',
      profile: {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`,
      },
      
    };
  }
  

  async logout(token: string) {
    return this.jwtTokenService.blacklist(token);
  }

  async validatePasswordResetToken(data: ValidatePasswordResetInput) {
    const isTokenValid = await this.passwordService.isResetTokenValid(
      data.resetToken,
    );

    if (!isTokenValid) {
      throw new BadRequestException({
        status: 'error',
        message: 'Reset token is invalid.',
      });
    }

    return { status: 'success', message: 'Reset token is valid.' };
  }

  async changePassword(data: ChangePasswordInput, user: SessionUser) {
    const passwordValid = await this.validateUser(user.email, data.oldPassword);

    if (!passwordValid) {
      throw new BadRequestException({
        status: 'error',
        message: 'Invalid Password',
      });
    }

    await this.passwordService.changePassword(user.userId, data.newPassword);

    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  }
}
