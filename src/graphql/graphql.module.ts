import { Module } from '@nestjs/common';
import { CarModule } from '../car/car.module';
import { UserModule } from '../user/user.module';
import { RentModule } from '../rent/rent.module';
import { CategoryModule } from '../category/category.module';
import { CarResolver } from './resolvers/car.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { RentResolver } from './resolvers/rent.resolver';
import { CategoryResolver } from './resolvers/category.resolver';

@Module({
  imports: [CarModule, UserModule, RentModule, CategoryModule],
  providers: [CarResolver, UserResolver, RentResolver, CategoryResolver],
})
export class GraphqlModule {}
