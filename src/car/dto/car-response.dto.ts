import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
}

export class CarImageDto {
  @ApiProperty() id: number;
  @ApiProperty() path: string;
  @ApiProperty() carId: number;
}

export class CarResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty() brand: string;
  @ApiProperty() filePath: string;
  @ApiProperty() seatCapacity: number;
  @ApiProperty() horsePower: number;
  @ApiProperty() maxGasoline: number;
  @ApiProperty() transmissionType: string;
  @ApiProperty() dailyRate: number;
  @ApiProperty() categoryId: number;
  @ApiProperty({ type: () => CategoryDto }) category: CategoryDto;
  @ApiProperty({ type: () => CarImageDto, isArray: true }) images: CarImageDto[];
}

export class PaginatedCarsDto {
  @ApiProperty({ type: [CarResponseDto] }) data: CarResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}
