import {
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  import { GqlExceptionFilter } from '@nestjs/graphql';
  
  @Catch(HttpException)
  export class GraphQLExceptionFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string' ? response : (response as any).message;
  
      return {
        code: exception.getStatus(),
        message,
      };
    }
  }
  