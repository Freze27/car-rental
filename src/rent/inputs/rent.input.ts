import { InputType, Field, Int, Float, PartialType } from '@nestjs/graphql';
import { IsNumber, IsDateString, Min } from 'class-validator';

@InputType({ description: 'Input for creating a rent' })
export class CreateRentInput {
  @Field(() => Int, { description: 'User ID' })
  @IsNumber()
  userId: number;

  @Field(() => Int, { description: 'Car ID' })
  @IsNumber()
  carId: number;

  @Field(() => Float, { description: 'Total rental amount in USD' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @Field({ description: 'Rental start date (ISO string)' })
  @IsDateString()
  startDate: string;

  @Field({ description: 'Rental end date (ISO string)' })
  @IsDateString()
  endDate: string;
}

@InputType({ description: 'Input for updating a rent' })
export class UpdateRentInput extends PartialType(CreateRentInput) {}
