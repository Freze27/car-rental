import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, HttpCode, HttpStatus, Res, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserRentDto, PaginatedUsersDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('api/users')
export class UserApiController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of users', type: PaginatedUsersDto })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res() res: Response,
  ) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      this.userService.findAllPaginated(skip, limitNum),
      this.userService.count(),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const baseUrl = `/api/users?limit=${limitNum}`;
    const links: string[] = [];
    if (pageNum > 1) links.push(`<${baseUrl}&page=${pageNum - 1}>; rel="prev"`);
    if (pageNum < totalPages) links.push(`<${baseUrl}&page=${pageNum + 1}>; rel="next"`);
    if (links.length) res.setHeader('Link', links.join(', '));

    return res.json({ data: users, total, page: pageNum, totalPages });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  @Get(':id/rents')
  @ApiOperation({ summary: 'Get rents of a user' })
  @ApiResponse({ status: 200, description: 'User rents', type: [UserRentDto] })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findRents(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user.rents;
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.userService.remove(id);
  }
}
