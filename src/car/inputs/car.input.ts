import { InputType, Field, Int, Float, PartialType } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

@InputType({ description: 'Input for creating a car' })
export class CreateCarInput {
  @Field({ description: 'Car title' })
  @IsString()
  title: string;

  @Field({ description: 'Car brand' })
  @IsString()
  brand: string;

  @Field({ description: 'Main image path' })
  @IsString()
  filePath: string;

  @Field(() => Int, { description: 'Number of seats' })
  @IsNumber()
  @Min(1)
  seatCapacity: number;

  @Field(() => Int, { description: 'Horse power' })
  @IsNumber()
  @Min(0)
  horsePower: number;

  @Field(() => Int, { description: 'Max gasoline in liters' })
  @IsNumber()
  @Min(0)
  maxGasoline: number;

  @Field({ description: 'Transmission type (Manual/Automatic)' })
  @IsString()
  transmissionType: string;

  @Field(() => Float, { description: 'Daily rental rate in USD' })
  @IsNumber()
  @Min(0)
  dailyRate: number;

  @Field(() => Int, { description: 'Category ID' })
  @IsNumber()
  categoryId: number;
}

@InputType({ description: 'Input for updating a car' })
export class UpdateCarInput extends PartialType(CreateCarInput) {}
