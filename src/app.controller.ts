import { Controller, Get, Query, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';

@ApiExcludeController()
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
    return { popularCars: cars.slice(0, 4), recommendedCars: cars.slice(4, 8), user };
  }

  @Get('profile')
  @Render('profile')
  async profile(@Query('userId') userId?: string) {
    const user = userId
      ? await this.prisma.user.findUnique({
          where: { id: Number(userId) },
          include: { rents: { include: { car: true } } },
        })
      : null;
    return { user };
  }
}
