import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { RentApiController } from './rent.api.controller';
import { RentResolver } from './rent.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RentController, RentApiController],
  providers: [RentService, RentResolver, PrismaService],
})
export class RentModule {}
