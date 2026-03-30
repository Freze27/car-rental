import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCarDto {
  @ApiPropertyOptional({ example: 'Porsche 911 Carrera S' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Porsche' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: '/cars/911/outside.webp' })
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  seatCapacity?: number;

  @ApiPropertyOptional({ example: 443 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  horsePower?: number;

  @ApiPropertyOptional({ example: 64 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxGasoline?: number;

  @ApiPropertyOptional({ example: 'Automatic' })
  @IsOptional()
  @IsString()
  transmissionType?: string;

  @ApiPropertyOptional({ example: 230 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  dailyRate?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({ example: ['/cars/911/front.webp'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
