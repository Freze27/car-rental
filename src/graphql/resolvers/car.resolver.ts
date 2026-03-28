import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { Role } from '@prisma/client';
import { CarService } from '../../car/car.service';
import { CarType } from '../types/car.type';
import { CreateCarInput, UpdateCarInput } from '../inputs/car.input';

@Resolver(() => CarType)
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Public()
  @Query(() => [CarType])
  async cars(
    @Args('brand', { nullable: true }) brand?: string,
    @Args('categoryId', { type: () => Int, nullable: true }) categoryId?: number,
    @Args('transmissionType', { nullable: true }) transmissionType?: string,
    @Args('minRate', { type: () => Number, nullable: true }) minRate?: number,
    @Args('maxRate', { type: () => Number, nullable: true }) maxRate?: number,
  ): Promise<CarType[]> {
    return this.carService.findAll({ brand, categoryId, transmissionType, minRate, maxRate });
  }

  @Public()
  @Query(() => CarType)
  async car(@Args('id', { type: () => Int }) id: number): Promise<CarType> {
    return this.carService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => CarType)
  async createCar(@Args('input') input: CreateCarInput): Promise<CarType> {
    return this.carService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => CarType)
  async updateCar(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCarInput,
  ): Promise<CarType> {
    return this.carService.update(id, input);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteCar(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.carService.remove(id);
    return true;
  }
}
