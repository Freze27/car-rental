import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Porsche 911 Carrera S' })
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

  @ApiProperty({ example: 443 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  horsePower: number;

  @ApiProperty({ example: 64 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxGasoline: number;

  @ApiProperty({ example: 'Automatic' })
  @IsString()
  transmissionType: string;

  @ApiProperty({ example: 230 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  dailyRate: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiPropertyOptional({ example: ['/cars/911/front.webp', '/cars/911/back.webp'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
