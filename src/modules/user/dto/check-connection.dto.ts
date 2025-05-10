import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../models/user.model';

@ObjectType()
export class CheckConnectionDTO {
  @Field()
  connectionStatus: string;
}

@ObjectType()
export class CreateUserResponse {
  @Field()
  message: string;

  @Field()
  code: number;

  @Field(() => User, { nullable: true })
  user?: User;
}
