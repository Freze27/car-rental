import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SAFE_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  image: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: SAFE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const take = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take, select: SAFE_SELECT, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count(),
    ]);

    return { data, total, page: Math.max(1, page), totalPages: Math.ceil(total / take) };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...SAFE_SELECT,
        rents: {
          include: { car: { include: { category: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    if (!dto.email.includes('@')) throw new BadRequestException('Invalid email format');
    if (dto.password.length < 6) throw new BadRequestException('Password must be at least 6 characters');

    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException(`Email ${dto.email} is already taken`);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: SAFE_SELECT,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto, select: SAFE_SELECT });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.rent.deleteMany({ where: { userId: id } });
    return this.prisma.user.delete({ where: { id }, select: { id: true, email: true } });
  }

  async getProfile(id: number) {
    const user = await this.findOne(id);
    const now = new Date();

    const totalSpent = user.rents.reduce((sum, r) => sum + r.totalAmount, 0);
    const activeRents = user.rents.filter((r) => r.endDate >= now);
    const completedRents = user.rents.filter((r) => r.endDate < now);

    return {
      ...user,
      stats: {
        totalRents: user.rents.length,
        activeRents: activeRents.length,
        completedRents: completedRents.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
      },
    };
  }
}
