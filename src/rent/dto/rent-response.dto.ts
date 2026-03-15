import { ApiProperty } from '@nestjs/swagger';

export class RentUserDto {
  @ApiProperty() id: number;
  @ApiProperty() displayName: string;
  @ApiProperty() email: string;
}

export class RentCarDto {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty() dailyRate: number;
}

export class RentResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() userId: number;
  @ApiProperty() carId: number;
  @ApiProperty() totalAmount: number;
  @ApiProperty() startDate: Date;
  @ApiProperty() endDate: Date;
  @ApiProperty({ type: () => RentUserDto }) user: RentUserDto;
  @ApiProperty({ type: () => RentCarDto }) car: RentCarDto;
}

export class PaginatedRentsDto {
  @ApiProperty({ type: [RentResponseDto] }) data: RentResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}
