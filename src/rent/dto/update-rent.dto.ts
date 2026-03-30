import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateRentDto {
  @ApiPropertyOptional({ example: '2025-06-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-06-07' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 1380 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount?: number;
}
