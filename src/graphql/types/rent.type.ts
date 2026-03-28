import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CarType } from './car.type';
import { UserType } from './user.type';

@ObjectType()
export class RentType {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  totalAmount: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  createdAt: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  carId: number;

  @Field(() => UserType, { nullable: true })
  user?: UserType;

  @Field(() => CarType, { nullable: true })
  car?: CarType;
}
