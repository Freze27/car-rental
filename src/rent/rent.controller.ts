import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { map } from 'rxjs';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@ApiTags('rents')
@ApiBearerAuth()
@Controller('api/rents')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Public()
  @Sse('events')
  @ApiOperation({ summary: 'SSE stream — fires on every new rent' })
  events() {
    return this.rentService.rentEvents$.pipe(
      map((data) => ({ data: JSON.stringify(data) })),
    );
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: '[ADMIN] Get all rents (paginated, filterable)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'userId', required: false, example: 1 })
  @ApiQuery({ name: 'carId', required: false, example: 1 })
  @ApiQuery({ name: 'from', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'to', required: false, example: '2025-12-31' })
  @ApiResponse({ status: 200, description: 'Paginated list of rents' })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('userId') userId?: string,
    @Query('carId') carId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.rentService.findAllPaginated(parseInt(page), parseInt(limit), {
      userId: userId ? parseInt(userId) : undefined,
      carId: carId ? parseInt(carId) : undefined,
      from,
      to,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rent by ID (own rent or admin)' })
  @ApiResponse({ status: 200, description: 'Rent found' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your rent' })
  @ApiResponse({ status: 404, description: 'Rent not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const rent = await this.rentService.findOne(id);
    if (user.role !== Role.ADMIN && rent.userId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }
    return rent;
  }

  @Post()
  @ApiOperation({ summary: 'Create a rent (userId must match current user unless admin)' })
  @ApiResponse({ status: 201, description: 'Rent created' })
  @ApiResponse({ status: 400, description: 'Validation / date error' })
  @ApiResponse({ status: 409, description: 'Car already rented for these dates' })
  create(@Body() dto: CreateRentDto, @CurrentUser() user: JwtPayload) {
    if (user.role !== Role.ADMIN && Number(dto.userId) !== user.sub) {
      throw new ForbiddenException('You can only create rents for yourself');
    }
    return this.rentService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a rent' })
  @ApiResponse({ status: 200, description: 'Rent updated' })
  @ApiResponse({ status: 409, description: 'Date conflict' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRentDto) {
    return this.rentService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[ADMIN] Delete a rent' })
  @ApiResponse({ status: 204, description: 'Rent deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentService.remove(id);
  }
}
