import { Prisma, PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      // create operation
      if (params.action === 'create' && params.model === 'User') {
        // hash user password
        const user = params.args.data;
        user.password = await this.cryptoService.hashPassword(user.password);
        params.args.data = user;
      }
      return next(params);
    });
  }

  async disconnect() {
    // Ensure that the PrismaClient disconnects from the database when the application is shut down.
    await this.$disconnect();
  }

}
