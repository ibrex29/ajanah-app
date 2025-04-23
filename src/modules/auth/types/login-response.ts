// auth/dto/login-response.dto.ts
import { ObjectType, Field, ID, InputType, ArgsType } from '@nestjs/graphql';

@ObjectType()
export class JwtPayloadGQL {
  @Field(() => ID)
  sub: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@ArgsType()
export class LoginArgs {
  @Field()
  email: string;

  @Field()
  password: string;
}

// @ObjectType()
// export class LoginResponse {
//   @Field()
//   accessToken: string;

//   @Field()
//   refreshToken: string;

//   @Field(() => JwtPayloadGQL)
//   profile: JwtPayloadGQL;
// }

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}