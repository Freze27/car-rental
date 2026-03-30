import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('api/categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create a category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  async create(@Body() dto: CreateCategoryDto) {
    const result = await this.categoryService.create(dto);
    await this.cacheManager.clear();
    return result;
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Rename a category' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Name already taken' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    const result = await this.categoryService.update(id, dto);
    await this.cacheManager.clear();
    return result;
  }
}
