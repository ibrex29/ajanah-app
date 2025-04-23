
import { ObjectType, Field } from '@nestjs/graphql';

export type JwtPayload = {
  sub: string;
  email?: string;
  role: string;
};

@ObjectType()
export class ValidateResetTokenResponse {
  @Field()
  status: 'success' | 'error';

  @Field()
  message: string;
}