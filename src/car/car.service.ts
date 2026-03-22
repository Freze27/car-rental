import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

export interface CarFilters {
  categoryId?: number;
  brand?: string;
  transmissionType?: string;
  minRate?: number;
  maxRate?: number;
}

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filters: CarFilters): Prisma.CarWhereInput {
    const where: Prisma.CarWhereInput = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brand) where.brand = { contains: filters.brand, mode: 'insensitive' };
    if (filters.transmissionType) where.transmissionType = { equals: filters.transmissionType, mode: 'insensitive' };
    if (filters.minRate !== undefined || filters.maxRate !== undefined) {
      where.dailyRate = {};
      if (filters.minRate !== undefined) where.dailyRate.gte = filters.minRate;
      if (filters.maxRate !== undefined) where.dailyRate.lte = filters.maxRate;
    }
    return where;
  }

  findAll(filters: CarFilters = {}) {
    return this.prisma.car.findMany({
      where: this.buildWhere(filters),
      include: { category: true, images: true },
      orderBy: { id: 'asc' },
    });
  }

  async findAllPaginated(page: number, limit: number, filters: CarFilters = {}) {
    const take = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * take;
    const where = this.buildWhere(filters);

    const [data, total] = await Promise.all([
      this.prisma.car.findMany({
        skip,
        take,
        where,
        include: { category: true, images: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.car.count({ where }),
    ]);

    return { data, total, page: Math.max(1, page), totalPages: Math.ceil(total / take) };
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: { category: true, images: true },
    });
    if (!car) throw new NotFoundException(`Car #${id} not found`);
    return car;
  }

  findAllCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  private async assertCategoryExists(id: number) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException(`Category #${id} not found`);
  }

  async create(dto: CreateCarDto) {
    await this.assertCategoryExists(dto.categoryId);
    if (dto.seatCapacity < 1) throw new BadRequestException('seatCapacity must be >= 1');
    if (dto.dailyRate <= 0) throw new BadRequestException('dailyRate must be > 0');

    const { images, ...data } = dto;
    let imageRecords: { path: string }[];

    if (images && images.length > 0) {
      imageRecords = images.map((path) => ({ path }));
    } else {
      const folder = data.filePath.substring(0, data.filePath.lastIndexOf('/') + 1);
      imageRecords = ['front', 'back', 'inside', 'outside'].map((name) => ({
        path: `${folder}${name}.webp`,
      }));
    }

    return this.prisma.car.create({
      data: { ...data, images: { create: imageRecords } },
      include: { category: true, images: true },
    });
  }

  async update(id: number, dto: UpdateCarDto) {
    await this.findOne(id);
    if (dto.categoryId !== undefined) await this.assertCategoryExists(dto.categoryId);
    if (dto.seatCapacity !== undefined && dto.seatCapacity < 1)
      throw new BadRequestException('seatCapacity must be >= 1');
    if (dto.dailyRate !== undefined && dto.dailyRate <= 0)
      throw new BadRequestException('dailyRate must be > 0');

    const { images: _images, ...data } = dto;

    return this.prisma.car.update({
      where: { id },
      data,
      include: { category: true, images: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.carImage.deleteMany({ where: { carId: id } });
    await this.prisma.rent.deleteMany({ where: { carId: id } });
    return this.prisma.car.delete({ where: { id } });
  }

  async addImage(carId: number, path: string) {
    await this.findOne(carId);
    return this.prisma.carImage.create({ data: { carId, path } });
  }

  async removeImage(imageId: number) {
    const image = await this.prisma.carImage.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundException(`Image #${imageId} not found`);
    return this.prisma.carImage.delete({ where: { id: imageId } });
  }
}
