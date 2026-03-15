import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, HttpCode, HttpStatus, Res, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { RentResponseDto, PaginatedRentsDto } from './dto/rent-response.dto';

@ApiTags('rents')
@Controller('api/rents')
export class RentApiController {
  constructor(private readonly rentService: RentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rents (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of rents', type: PaginatedRentsDto })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res() res: Response,
  ) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [rents, total] = await Promise.all([
      this.rentService.findAllPaginated(skip, limitNum),
      this.rentService.count(),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const baseUrl = `/api/rents?limit=${limitNum}`;
    const links: string[] = [];
    if (pageNum > 1) links.push(`<${baseUrl}&page=${pageNum - 1}>; rel="prev"`);
    if (pageNum < totalPages) links.push(`<${baseUrl}&page=${pageNum + 1}>; rel="next"`);
    if (links.length) res.setHeader('Link', links.join(', '));

    return res.json({ data: rents, total, page: pageNum, totalPages });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rent by id' })
  @ApiResponse({ status: 200, description: 'Rent found', type: RentResponseDto })
  @ApiResponse({ status: 404, description: 'Rent not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const rent = await this.rentService.findOne(id);
    if (!rent) throw new NotFoundException(`Rent #${id} not found`);
    return rent;
  }

  @Post()
  @ApiOperation({ summary: 'Create a rent' })
  @ApiResponse({ status: 201, description: 'Rent created', type: RentResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateRentDto) {
    return this.rentService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rent' })
  @ApiResponse({ status: 200, description: 'Rent updated', type: RentResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Rent not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRentDto) {
    const rent = await this.rentService.findOne(id);
    if (!rent) throw new NotFoundException(`Rent #${id} not found`);
    return this.rentService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a rent' })
  @ApiResponse({ status: 204, description: 'Rent deleted' })
  @ApiResponse({ status: 404, description: 'Rent not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const rent = await this.rentService.findOne(id);
    if (!rent) throw new NotFoundException(`Rent #${id} not found`);
    return this.rentService.remove(id);
  }
}
