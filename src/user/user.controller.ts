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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: '[ADMIN] Get all users (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.userService.findAllPaginated(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (own profile or admin)' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    if (user.role !== Role.ADMIN && user.sub !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.findOne(id);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get user profile with rental stats (own or admin)' })
  @ApiResponse({ status: 200, description: 'User profile with stats' })
  getProfile(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    if (user.role !== Role.ADMIN && user.sub !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.getProfile(id);
  }

  @Get(':id/rents')
  @ApiOperation({ summary: 'Get rental history of a user (own or admin)' })
  @ApiResponse({ status: 200, description: 'Rent history' })
  async getRents(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    if (user.role !== Role.ADMIN && user.sub !== id) {
      throw new ForbiddenException('Access denied');
    }
    const profile = await this.userService.findOne(id);
    return profile.rents;
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create a user directly' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email already taken' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[ADMIN] Delete a user (cascades rents)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile (own or admin)' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (user.role !== Role.ADMIN && user.sub !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.update(id, dto);
  }
}
