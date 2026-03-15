import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { CarApiController } from './car.api.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CarController, CarApiController],
  providers: [CarService, PrismaService],
})
export class CarModule {}
