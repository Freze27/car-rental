import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  displayName: string;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field()
  role: string;

  @Field()
  createdAt: Date;
}
