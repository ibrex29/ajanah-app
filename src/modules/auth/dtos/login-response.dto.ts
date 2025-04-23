import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class JwtPayload {
  @Field(() => ID)
  sub: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => JwtPayload)
  profile: JwtPayload;
}