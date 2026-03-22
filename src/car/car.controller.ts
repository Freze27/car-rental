import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@ApiTags('cars')
@ApiBearerAuth()
@Controller('api/cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get cars (paginated, filterable)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'categoryId', required: false, example: 1 })
  @ApiQuery({ name: 'brand', required: false, example: 'Porsche' })
  @ApiQuery({ name: 'transmissionType', required: false, example: 'Automatic' })
  @ApiQuery({ name: 'minRate', required: false, example: 100 })
  @ApiQuery({ name: 'maxRate', required: false, example: 300 })
  @ApiResponse({ status: 200, description: 'Paginated list of cars' })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('categoryId') categoryId?: string,
    @Query('brand') brand?: string,
    @Query('transmissionType') transmissionType?: string,
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
  ) {
    return this.carService.findAllPaginated(parseInt(page), parseInt(limit), {
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      brand,
      transmissionType,
      minRate: minRate ? parseFloat(minRate) : undefined,
      maxRate: maxRate ? parseFloat(maxRate) : undefined,
    });
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  findCategories() {
    return this.carService.findAllCategories();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  @ApiResponse({ status: 200, description: 'Car found' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create a car' })
  @ApiResponse({ status: 201, description: 'Car created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  create(@Body() dto: CreateCarDto) {
    return this.carService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a car' })
  @ApiResponse({ status: 200, description: 'Car updated' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCarDto) {
    return this.carService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[ADMIN] Delete a car (cascades images & rents)' })
  @ApiResponse({ status: 204, description: 'Car deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carService.remove(id);
  }

  @Roles(Role.ADMIN)
  @Post(':id/images')
  @ApiOperation({ summary: '[ADMIN] Add image to a car' })
  addImage(@Param('id', ParseIntPipe) carId: number, @Body('path') path: string) {
    return this.carService.addImage(carId, path);
  }

  @Roles(Role.ADMIN)
  @Delete('images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[ADMIN] Delete a car image' })
  removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.carService.removeImage(imageId);
  }
}
