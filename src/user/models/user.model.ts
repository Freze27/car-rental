import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Rent summary in user context' })
export class UserRentModel {
  @Field(() => Int, { description: 'Rent ID' })
  id: number;

  @Field(() => Int, { description: 'Car ID' })
  carId: number;

  @Field({ description: 'Rental start date' })
  startDate: Date;

  @Field({ description: 'Rental end date' })
  endDate: Date;
}

@ObjectType({ description: 'User entity' })
export class UserModel {
  @Field(() => Int, { description: 'User ID' })
  id: number;

  @Field({ description: 'Email address' })
  email: string;

  @Field({ description: 'First name' })
  firstName: string;

  @Field({ description: 'Last name' })
  lastName: string;

  @Field({ description: 'Display name' })
  displayName: string;

  @Field(() => String, { nullable: true, description: 'Avatar image path' })
  image?: string | null;

  @Field(() => [UserRentModel], { nullable: true, description: 'User rents' })
  rents?: UserRentModel[];
}

@ObjectType({ description: 'Paginated list of users' })
export class PaginatedUsersModel {
  @Field(() => [UserModel], { description: 'List of users' })
  data: UserModel[];

  @Field(() => Int, { description: 'Total number of users' })
  total: number;

  @Field(() => Int, { description: 'Current page' })
  page: number;

  @Field(() => Int, { description: 'Total pages' })
  totalPages: number;
}
