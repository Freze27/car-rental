import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateCarInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  brand: string;

  @Field()
  @IsString()
  filePath: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  seatCapacity: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  horsePower: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  maxGasoline: number;

  @Field()
  @IsString()
  transmissionType: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  dailyRate: number;

  @Field(() => Int)
  @IsNumber()
  categoryId: number;
}

@InputType()
export class UpdateCarInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  brand?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  filePath?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  seatCapacity?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  horsePower?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxGasoline?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transmissionType?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
