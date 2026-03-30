import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { Cache } from 'cache-manager';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CarService } from './car.service';
import { StorageService } from '../storage/storage.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@ApiTags('cars')
@ApiBearerAuth()
@Controller('api/cars')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly storageService: StorageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @Get()
  @UseInterceptors(CacheInterceptor)
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
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
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
  async create(@Body() dto: CreateCarDto) {
    const result = await this.carService.create(dto);
    await this.cacheManager.clear();
    return result;
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a car' })
  @ApiResponse({ status: 200, description: 'Car updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCarDto) {
    const result = await this.carService.update(id, dto);
    await this.cacheManager.clear();
    return result;
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[ADMIN] Delete a car (cascades images & rents)' })
  @ApiResponse({ status: 204, description: 'Car deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.carService.remove(id);
    await this.cacheManager.clear();
    return result;
  }

  @Roles(Role.ADMIN)
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
        return cb(new Error('Only JPEG, PNG and WebP images are allowed'), false);
      }
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: '[ADMIN] Upload image for a car to Yandex Storage' })
  @ApiResponse({ status: 201, description: 'Image uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async addImage(
    @Param('id', ParseIntPipe) carId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.storageService.upload(file, `cars/${carId}`);
    return this.carService.addImage(carId, url);
  }

  @Roles(Role.ADMIN)
  @Delete('images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[ADMIN] Delete a car image' })
  @ApiResponse({ status: 204, description: 'Image deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.carService.removeImage(imageId);
  }
}
