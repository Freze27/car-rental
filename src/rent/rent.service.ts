import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { Subject } from 'rxjs';

@Injectable()
export class RentService {
  private rentCreated$ = new Subject<{ carTitle: string }>();

  get rentEvents$() {
    return this.rentCreated$.asObservable();
  }

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.rent.findMany({
      include: { user: true, car: true },
    });
  }

  findOne(id: number) {
    return this.prisma.rent.findUnique({
      where: { id },
      include: { user: true, car: true },
    });
  }

  async create(dto: CreateRentDto) {
    const rent = await this.prisma.rent.create({
      data: {
        userId: Number(dto.userId),
        carId: Number(dto.carId),
        totalAmount: Number(dto.totalAmount),
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
      include: { user: true, car: true },
    });
    this.rentCreated$.next({ carTitle: rent.car.title });
    return rent;
  }

  update(id: number, dto: UpdateRentDto) {
    return this.prisma.rent.update({
      where: { id },
      data: {
        ...(dto.totalAmount !== undefined && { totalAmount: Number(dto.totalAmount) }),
        ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate !== undefined && { endDate: new Date(dto.endDate) }),
      },
      include: { user: true, car: true },
    });
  }

  remove(id: number) {
    return this.prisma.rent.delete({ where: { id } });
  }
}
