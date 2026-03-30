import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  carId: number;

  @ApiProperty({ example: '2025-06-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-07' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 1380, description: 'Если не указан — считается автоматически (dailyRate × дни)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount?: number;
}
