import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CategoryType } from './category.type';

@ObjectType()
export class CarImageType {
  @Field(() => Int)
  id: number;

  @Field()
  path: string;
}

@ObjectType()
export class CarType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  brand: string;

  @Field()
  filePath: string;

  @Field(() => Int)
  seatCapacity: number;

  @Field(() => Int)
  horsePower: number;

  @Field(() => Int)
  maxGasoline: number;

  @Field()
  transmissionType: string;

  @Field(() => Float)
  dailyRate: number;

  @Field(() => CategoryType, { nullable: true })
  category?: CategoryType;

  @Field(() => [CarImageType], { nullable: true })
  images?: CarImageType[];
}
