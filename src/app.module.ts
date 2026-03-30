import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CarModule } from './car/car.module';
import { RentModule } from './rent/rent.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    CacheModule.register({ ttl: 60000, isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
      playground: true,
      introspection: true,
      csrfPrevention: false,
    }),
    AuthModule,
    CarModule,
    RentModule,
    UserModule,
    CategoryModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
