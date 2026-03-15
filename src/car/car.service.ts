import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.car.findMany({
      include: { category: true, images: true },
    });
  }

  findOne(id: number) {
    return this.prisma.car.findUnique({
      where: { id },
      include: { category: true, images: true },
    });
  }

  create(dto: CreateCarDto) {
    const { images, ...data } = dto;
    return this.prisma.car.create({
      data: {
        ...data,
        categoryId: Number(data.categoryId),
        seatCapacity: Number(data.seatCapacity),
        horsePower: Number(data.horsePower),
        maxGasoline: Number(data.maxGasoline),
        dailyRate: Number(data.dailyRate),
        images: images ? { create: images.map((path: string) => ({ path })) } : undefined,
      },
      include: { category: true, images: true },
    });
  }

  update(id: number, dto: UpdateCarDto) {
    const { images, ...data } = dto;
    return this.prisma.car.update({
      where: { id },
      data: {
        ...data,
        ...(data.categoryId !== undefined && { categoryId: Number(data.categoryId) }),
        ...(data.seatCapacity !== undefined && { seatCapacity: Number(data.seatCapacity) }),
        ...(data.horsePower !== undefined && { horsePower: Number(data.horsePower) }),
        ...(data.maxGasoline !== undefined && { maxGasoline: Number(data.maxGasoline) }),
        ...(data.dailyRate !== undefined && { dailyRate: Number(data.dailyRate) }),
      },
      include: { category: true, images: true },
    });
  }

  remove(id: number) {
    return this.prisma.car.delete({ where: { id } });
  }
}
