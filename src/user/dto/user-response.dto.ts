import { ApiProperty } from '@nestjs/swagger';

export class UserRentDto {
  @ApiProperty() id: number;
  @ApiProperty() carId: number;
  @ApiProperty() totalAmount: number;
  @ApiProperty() startDate: Date;
  @ApiProperty() endDate: Date;
}

export class UserResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() email: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() displayName: string;
  @ApiProperty({ type: [UserRentDto] }) rents: UserRentDto[];
}

export class PaginatedUsersDto {
  @ApiProperty({ type: [UserResponseDto] }) data: UserResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}
