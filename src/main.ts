import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLExceptionFilter } from './common/exceptions/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  app.useGlobalFilters(new GraphQLExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
