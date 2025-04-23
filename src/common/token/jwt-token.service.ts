import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JWT_ACCESS_EXPIRY, JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRY, JWT_REFRESH_SECRET, MILLISECONDS_PER_SECOND } from '../constants';
import { JwtPayload } from 'src/modules/auth/types';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  [key: string]: any;
}

@Injectable()
export class JwtTokenService {
  private JWT_ACCESS_SECRET;
  private JWT_ACCESS_EXPIRY;
  private JWT_REFRESH_SECRET;
  private JWT_REFRESH_EXPIRY;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
    private get secrets() {
      return {
        access: {
          secret: this.configService.getOrThrow(JWT_ACCESS_SECRET),
          expiresIn: this.configService.getOrThrow(JWT_ACCESS_EXPIRY),
        },
        refresh: {
          secret: this.configService.getOrThrow(JWT_REFRESH_SECRET),
          expiresIn: this.configService.getOrThrow(JWT_REFRESH_EXPIRY),
        },
      };
    }

    async generateToken(payload: TokenPayload): Promise<{
      accessToken: string;
      refreshToken: string;
    }> {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(payload, {
            secret: this.secrets.access.secret,
            expiresIn: this.secrets.access.expiresIn,
          }),
          this.jwtService.signAsync(payload, {
            secret: this.secrets.refresh.secret,
            expiresIn: this.secrets.refresh.expiresIn,
          }),
        ]);
  
        return { accessToken, refreshToken };
      } catch (error) {
        console.error('Token generation failed:', error);
        throw new Error('Token generation failed');
      }
    }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.JWT_ACCESS_SECRET,
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.JWT_REFRESH_SECRET,
    });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
      where: { token },
    });
    return !!blacklistedToken;
  }

  private extractExpirationTime(token: string): number | null {
    try {
      const { exp } = this.jwtService.decode(token) as { exp: number };
      return exp; // return jwt exipry in seconds
    } catch (error) {
      return null; // Invalid token or unable to decode
    }
  }

  async blacklist(token: string): Promise<void> {
    const expirationTime = this.extractExpirationTime(token);
    const expirationDate = expirationTime
      ? new Date(expirationTime * MILLISECONDS_PER_SECOND)
      : new Date(Date.now() + ms(this.JWT_ACCESS_EXPIRY));

    await this.prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: expirationDate,
      },
    });
  }
}
