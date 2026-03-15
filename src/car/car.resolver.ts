import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CarService } from './car.service';
import { CarModel, PaginatedCarsModel, CategoryModel, CarImageModel } from './models/car.model';
import { CreateCarInput, UpdateCarInput } from './inputs/car.input';

@Resolver(() => CarModel)
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Query(() => PaginatedCarsModel, { description: 'Get paginated list of cars', complexity: 5 })
  async cars(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('categoryId', { type: () => Int, nullable: true }) categoryId?: number,
  ): Promise<PaginatedCarsModel> {
    const limitNum = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * limitNum;
    const [data, total] = await Promise.all([
      this.carService.findAllPaginated(skip, limitNum, categoryId),
      this.carService.count(categoryId),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limitNum) };
  }

  @Query(() => CarModel, { nullable: true, description: 'Get a car by ID', complexity: 2 })
  car(@Args('id', { type: () => Int }) id: number) {
    return this.carService.findOne(id);
  }

  @Query(() => [CategoryModel], { description: 'Get all car categories', complexity: 1 })
  categories() {
    return this.carService.findAllCategories();
  }

  @ResolveField(() => CategoryModel, { nullable: true, description: 'Resolve car category' })
  category(@Parent() car: CarModel) {
    return (car as any).category ?? null;
  }

  @ResolveField(() => [CarImageModel], { nullable: true, description: 'Resolve car images' })
  images(@Parent() car: CarModel) {
    return (car as any).images ?? [];
  }

  @Mutation(() => CarModel, { description: 'Add a new car to the fleet' })
  addCar(@Args('input') input: CreateCarInput) {
    return this.carService.create(input as any);
  }

  @Mutation(() => CarModel, { description: 'Update car details' })
  updateCarDetails(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCarInput,
  ) {
    return this.carService.update(id, input as any);
  }

  @Mutation(() => CarModel, { description: 'Remove a car from the fleet' })
  removeCar(@Args('id', { type: () => Int }) id: number) {
    return this.carService.remove(id);
  }
}
