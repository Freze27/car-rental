import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  carId: number;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  @ApiProperty({ example: '2025-06-01' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2025-06-07' })
  @IsDateString()
  endDate: Date;
}
