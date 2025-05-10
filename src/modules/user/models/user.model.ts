import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  otherNames?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  isActive: boolean;

  @Field()
  role: string;
}
