import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

export interface RentFilters {
  userId?: number;
  carId?: number;
  from?: string;
  to?: string;
}

@Injectable()
export class RentService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly rentCreated$ = new Subject<{ carTitle: string; userId: number }>();

  get rentEvents$() {
    return this.rentCreated$.asObservable();
  }

  findAll(filters: RentFilters = {}) {
    return this.prisma.rent.findMany({
      where: this.buildWhere(filters),
      include: { user: true, car: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPaginated(page: number, limit: number, filters: RentFilters = {}) {
    const take = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * take;
    const where = this.buildWhere(filters);

    const [data, total] = await Promise.all([
      this.prisma.rent.findMany({
        skip,
        take,
        where,
        include: { user: true, car: { include: { category: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rent.count({ where }),
    ]);

    return { data, total, page: Math.max(1, page), totalPages: Math.ceil(total / take) };
  }

  async findOne(id: number) {
    const rent = await this.prisma.rent.findUnique({
      where: { id },
      include: { user: true, car: { include: { category: true } } },
    });
    if (!rent) throw new NotFoundException(`Rent #${id} not found`);
    return rent;
  }

  async create(dto: CreateRentDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    this.validateDates(startDate, endDate, true);

    const [user, car] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: Number(dto.userId) } }),
      this.prisma.car.findUnique({ where: { id: Number(dto.carId) } }),
    ]);
    if (!user) throw new NotFoundException(`User #${dto.userId} not found`);
    if (!car) throw new NotFoundException(`Car #${dto.carId} not found`);

    await this.assertNoConflict(Number(dto.carId), startDate, endDate);

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000);
    const totalAmount = dto.totalAmount !== undefined ? Number(dto.totalAmount) : car.dailyRate * days;

    const rent = await this.prisma.rent.create({
      data: {
        userId: Number(dto.userId),
        carId: Number(dto.carId),
        startDate,
        endDate,
        totalAmount,
      },
      include: { user: true, car: { include: { category: true } } },
    });

    this.rentCreated$.next({ carTitle: car.title, userId: rent.userId });
    return rent;
  }

  async update(id: number, dto: UpdateRentDto) {
    const existing = await this.findOne(id);
    const startDate = dto.startDate ? new Date(dto.startDate) : existing.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;

    this.validateDates(startDate, endDate, false);

    if (dto.startDate || dto.endDate) {
      await this.assertNoConflict(existing.carId, startDate, endDate, id);
    }

    let totalAmount = existing.totalAmount;
    if ((dto.startDate || dto.endDate) && dto.totalAmount === undefined) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000);
      totalAmount = existing.car.dailyRate * days;
    } else if (dto.totalAmount !== undefined) {
      totalAmount = Number(dto.totalAmount);
    }

    return this.prisma.rent.update({
      where: { id },
      data: { startDate, endDate, totalAmount },
      include: { user: true, car: { include: { category: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.rent.delete({ where: { id } });
  }

  private buildWhere(filters: RentFilters) {
    const where: Record<string, unknown> = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.carId) where.carId = filters.carId;
    if (filters.from || filters.to) {
      where.startDate = {};
      if (filters.from) (where.startDate as Record<string, unknown>).gte = new Date(filters.from);
      if (filters.to) (where.startDate as Record<string, unknown>).lte = new Date(filters.to);
    }
    return where;
  }

  private validateDates(startDate: Date, endDate: Date, checkPast: boolean) {
    if (isNaN(startDate.getTime())) throw new BadRequestException('Invalid startDate');
    if (isNaN(endDate.getTime())) throw new BadRequestException('Invalid endDate');
    if (startDate >= endDate) throw new BadRequestException('startDate must be before endDate');
    if (checkPast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) throw new BadRequestException('startDate cannot be in the past');
    }
  }

  private async assertNoConflict(carId: number, startDate: Date, endDate: Date, excludeId?: number) {
    const conflict = await this.prisma.rent.findFirst({
      where: {
        carId,
        ...(excludeId ? { id: { not: excludeId } } : {}),
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
      },
    });
    if (conflict) {
      throw new ConflictException(
        `Car is already rented from ${conflict.startDate.toISOString().slice(0, 10)} to ${conflict.endDate.toISOString().slice(0, 10)}`,
      );
    }
  }
}
