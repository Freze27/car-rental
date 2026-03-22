import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RentController],
  providers: [RentService, PrismaService],
  exports: [RentService],
})
export class RentModule {}
