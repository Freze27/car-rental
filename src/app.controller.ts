import { Controller, Get, Query, Render } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('home')
  async home(@Query('userId') userId?: string) {
    const cars = await this.prisma.car.findMany({
      include: { category: true, images: true },
    });
    const user = userId
      ? await this.prisma.user.findUnique({ where: { id: Number(userId) } })
      : null;
    return { popularCars: cars.slice(0, 4), recommendedCars: cars.slice(4), user };
  }
}
