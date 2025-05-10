import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  otherNames?: string;

  @Field({ nullable: true })
  @IsString()
  gender: string;

  @Field()
  @IsString()
  role: string;

  @Field({ nullable: true })
  @IsDate()
  dob: Date;

  @Field({ nullable: true })
  @IsString()
  address: string;

  @Field({ nullable: true })
  @IsString()
  state: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
