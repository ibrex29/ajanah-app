import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ValidatePasswordResetInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  resetToken: string;
}
