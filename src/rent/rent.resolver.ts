import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { RentService } from './rent.service';
import { RentModel, PaginatedRentsModel, RentUserModel, RentCarModel } from './models/rent.model';
import { CreateRentInput, UpdateRentInput } from './inputs/rent.input';

@Resolver(() => RentModel)
export class RentResolver {
  constructor(private readonly rentService: RentService) {}

  @Query(() => PaginatedRentsModel, { description: 'Get paginated list of rents', complexity: 5 })
  async rents(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedRentsModel> {
    const limitNum = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * limitNum;
    const [data, total] = await Promise.all([
      this.rentService.findAllPaginated(skip, limitNum),
      this.rentService.count(),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limitNum) };
  }

  @Query(() => RentModel, { nullable: true, description: 'Get a rent by ID', complexity: 2 })
  rent(@Args('id', { type: () => Int }) id: number) {
    return this.rentService.findOne(id);
  }

  @ResolveField(() => RentUserModel, { nullable: true, description: 'Resolve renting user' })
  user(@Parent() rent: RentModel) {
    return (rent as any).user ?? null;
  }

  @ResolveField(() => RentCarModel, { nullable: true, description: 'Resolve rented car' })
  car(@Parent() rent: RentModel) {
    return (rent as any).car ?? null;
  }

  @Mutation(() => RentModel, { description: 'Book a car for a given period' })
  bookCar(@Args('input') input: CreateRentInput) {
    return this.rentService.create(input as any);
  }

  @Mutation(() => RentModel, { description: 'Extend or modify a rental period' })
  extendRental(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateRentInput,
  ) {
    return this.rentService.update(id, input as any);
  }

  @Mutation(() => RentModel, { description: 'Cancel an existing rental' })
  cancelRent(@Args('id', { type: () => Int }) id: number) {
    return this.rentService.remove(id);
  }
}
