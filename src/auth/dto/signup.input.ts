import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @Field()
  email: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username name must be string type' })
  @Field()
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be string type' })
  @Field()
  password: string;
}
