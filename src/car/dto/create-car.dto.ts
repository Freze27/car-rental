import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarDto {
  @ApiProperty({ example: 'Porsche 911' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Porsche' })
  @IsString()
  brand: string;

  @ApiProperty({ example: '/cars/911/outside.webp' })
  @IsString()
  filePath: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  seatCapacity: number;

  @ApiProperty({ example: 450 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  horsePower: number;

  @ApiProperty({ example: 64 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxGasoline: number;

  @ApiProperty({ example: 'Manual' })
  @IsString()
  transmissionType: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dailyRate: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiPropertyOptional({ example: ['/cars/911/front.webp'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
