import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ example: 'eyJhbGci...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
