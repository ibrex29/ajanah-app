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

  @Field()
  gender: string;

  @Field()
  dob: Date;

  @Field()
  address: string;

  @Field()
  state: string;

  @Field()
  country: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  isActive: boolean;

  @Field()
  role: string;
}
