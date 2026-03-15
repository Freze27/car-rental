import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserApiController } from './user.api.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserController, UserApiController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
