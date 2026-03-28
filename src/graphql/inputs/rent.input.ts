import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateRentInput {
  @Field(() => Int)
  @IsNumber()
  userId: number;

  @Field(() => Int)
  @IsNumber()
  carId: number;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;
}

@InputType()
export class UpdateRentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}
