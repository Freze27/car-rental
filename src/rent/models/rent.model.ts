import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({ description: 'User info in rent context' })
export class RentUserModel {
  @Field(() => Int, { description: 'User ID' })
  id: number;

  @Field({ description: 'Display name' })
  displayName: string;

  @Field({ description: 'Email address' })
  email: string;
}

@ObjectType({ description: 'Car info in rent context' })
export class RentCarModel {
  @Field(() => Int, { description: 'Car ID' })
  id: number;

  @Field({ description: 'Car title' })
  title: string;

  @Field(() => Float, { description: 'Daily rate' })
  dailyRate: number;
}

@ObjectType({ description: 'Rent entity' })
export class RentModel {
  @Field(() => Int, { description: 'Rent ID' })
  id: number;

  @Field(() => Int, { description: 'User ID' })
  userId: number;

  @Field(() => Int, { description: 'Car ID' })
  carId: number;

  @Field(() => Float, { description: 'Total rental amount in USD' })
  totalAmount: number;

  @Field({ description: 'Rental start date' })
  startDate: Date;

  @Field({ description: 'Rental end date' })
  endDate: Date;

  @Field(() => RentUserModel, { nullable: true, description: 'Renting user' })
  user?: RentUserModel;

  @Field(() => RentCarModel, { nullable: true, description: 'Rented car' })
  car?: RentCarModel;
}

@ObjectType({ description: 'Paginated list of rents' })
export class PaginatedRentsModel {
  @Field(() => [RentModel], { description: 'List of rents' })
  data: RentModel[];

  @Field(() => Int, { description: 'Total number of rents' })
  total: number;

  @Field(() => Int, { description: 'Current page' })
  page: number;

  @Field(() => Int, { description: 'Total pages' })
  totalPages: number;
}
