import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserApiController } from './user.api.controller';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserController, UserApiController],
  providers: [UserService, UserResolver, PrismaService],
})
export class UserModule {}
