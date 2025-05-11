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
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  // @Field(() => Profile, { nullable: true })
  // profile?: Profile;
}

@ObjectType()
export class Profile {
  @Field(() => String)
  sub: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  role: string;

  @Field(() => String)
  name: string;
}


@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

