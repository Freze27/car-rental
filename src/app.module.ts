import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { CarModule } from './car/car.module';
import { RentModule } from './rent/rent.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CarModule, RentModule, UserModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
