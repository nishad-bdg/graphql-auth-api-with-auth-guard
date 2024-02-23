import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id?: number;

  @Field()
  email?: string;

  @Field()
  username?: string;

  @Field()
  refreshToken?: string;

  @Field()
  password?: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
