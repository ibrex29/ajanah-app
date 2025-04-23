import { Global, Module } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, CryptoService],
  exports: [PrismaService],
})
export class PrismaModule {}
