import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './common/mail/mail.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_ACCESS_SECRET } from './common/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // Cache env variables in memory
      envFilePath: ['docker.env', '.env'],
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '19000s' },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    MailModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: {
        settings: {
          'request.credentials': 'include', // Enables cookies & auth headers
        },
      },
      context: ({ req, res }) => ({ req, res }),
    }),
  ], // Ensure you have a closing bracket here
})
export class AppModule {}