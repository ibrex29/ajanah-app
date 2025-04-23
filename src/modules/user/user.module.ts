
import { Module } from '@nestjs/common';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
@Module({
  providers: [UserService, PrismaService, CryptoService, UserResolver],
  exports: [UserService, CryptoService],
})
export class UserModule { }
