import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, HttpCode, HttpStatus, Res, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarResponseDto, CarImageDto, PaginatedCarsDto } from './dto/car-response.dto';

@ApiTags('cars')
@Controller('api/cars')
export class CarApiController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'categoryId', required: false, example: 1 })
  @ApiResponse({ status: 200, description: 'List of cars', type: PaginatedCarsDto })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res() res: Response,
    @Query('categoryId') categoryId?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      this.carService.findAllPaginated(skip, limitNum, categoryId ? Number(categoryId) : undefined),
      this.carService.count(categoryId ? Number(categoryId) : undefined),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const baseUrl = `/api/cars?limit=${limitNum}`;
    const links: string[] = [];
    if (pageNum > 1) links.push(`<${baseUrl}&page=${pageNum - 1}>; rel="prev"`);
    if (pageNum < totalPages) links.push(`<${baseUrl}&page=${pageNum + 1}>; rel="next"`);
    if (links.length) res.setHeader('Link', links.join(', '));

    return res.json({ data: cars, total, page: pageNum, totalPages });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by id' })
  @ApiResponse({ status: 200, description: 'Car found', type: CarResponseDto })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const car = await this.carService.findOne(id);
    if (!car) throw new NotFoundException(`Car #${id} not found`);
    return car;
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'Get images of a car' })
  @ApiResponse({ status: 200, description: 'Car images', type: [CarImageDto] })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async findImages(@Param('id', ParseIntPipe) id: number) {
    const car = await this.carService.findOne(id);
    if (!car) throw new NotFoundException(`Car #${id} not found`);
    return car.images;
  }

  @Post()
  @ApiOperation({ summary: 'Create a car' })
  @ApiResponse({ status: 201, description: 'Car created', type: CarResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateCarDto) {
    return this.carService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a car' })
  @ApiResponse({ status: 200, description: 'Car updated', type: CarResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCarDto) {
    const car = await this.carService.findOne(id);
    if (!car) throw new NotFoundException(`Car #${id} not found`);
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({ status: 204, description: 'Car deleted' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const car = await this.carService.findOne(id);
    if (!car) throw new NotFoundException(`Car #${id} not found`);
    return this.carService.remove(id);
  }
}
