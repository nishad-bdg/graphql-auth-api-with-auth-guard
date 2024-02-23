import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SigninInput {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @IsEmail({}, { message: 'Must be a valid email address' })
  @Field()
  email: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @Field()
  password: string;
}
