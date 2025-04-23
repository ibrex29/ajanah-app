import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
