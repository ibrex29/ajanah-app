import { BadRequestException, Injectable } from '@nestjs/common';
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
    if (!user) return null;

    const isMatch = await this.cryptoService.comparePassword(
      inputtedPassword,
      user.password,
    );

    if (!isMatch) return null;

    const { password, ...result } = user;
    return result;
  }

  async login(user: AuthUser) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = await this.jwtTokenService.generateToken(payload);
    
    return {
      ...tokens,
      profile: payload,
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
