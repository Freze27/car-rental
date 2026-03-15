import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Car category' })
export class CategoryModel {
  @Field(() => Int, { description: 'Category ID' })
  id: number;

  @Field({ description: 'Category name' })
  name: string;
}

@ObjectType({ description: 'Car image' })
export class CarImageModel {
  @Field(() => Int, { description: 'Image ID' })
  id: number;

  @Field({ description: 'Image path' })
  path: string;

  @Field(() => Int, { description: 'Car ID' })
  carId: number;
}

@ObjectType({ description: 'Car entity' })
export class CarModel {
  @Field(() => Int, { description: 'Car ID' })
  id: number;

  @Field({ description: 'Car title' })
  title: string;

  @Field({ description: 'Car brand' })
  brand: string;

  @Field({ description: 'Main image path' })
  filePath: string;

  @Field(() => Int, { description: 'Number of seats' })
  seatCapacity: number;

  @Field(() => Int, { description: 'Horse power' })
  horsePower: number;

  @Field(() => Int, { description: 'Max gasoline capacity in liters' })
  maxGasoline: number;

  @Field({ description: 'Transmission type (Manual/Automatic)' })
  transmissionType: string;

  @Field(() => Float, { description: 'Daily rental rate in USD' })
  dailyRate: number;

  @Field(() => Int, { description: 'Category ID' })
  categoryId: number;

  @Field(() => CategoryModel, { nullable: true, description: 'Car category' })
  category?: CategoryModel;

  @Field(() => [CarImageModel], { nullable: true, description: 'Car images' })
  images?: CarImageModel[];
}

@ObjectType({ description: 'Paginated list of cars' })
export class PaginatedCarsModel {
  @Field(() => [CarModel], { description: 'List of cars' })
  data: CarModel[];

  @Field(() => Int, { description: 'Total number of cars' })
  total: number;

  @Field(() => Int, { description: 'Current page' })
  page: number;

  @Field(() => Int, { description: 'Total pages' })
  totalPages: number;
}
