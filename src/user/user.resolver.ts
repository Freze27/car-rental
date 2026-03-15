import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel, PaginatedUsersModel, UserRentModel } from './models/user.model';
import { CreateUserInput, UpdateUserInput } from './inputs/user.input';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => PaginatedUsersModel, { description: 'Get paginated list of users', complexity: 5 })
  async users(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedUsersModel> {
    const limitNum = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * limitNum;
    const [data, total] = await Promise.all([
      this.userService.findAllPaginated(skip, limitNum),
      this.userService.count(),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limitNum) };
  }

  @Query(() => UserModel, { nullable: true, description: 'Get a user by ID', complexity: 2 })
  user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @ResolveField(() => [UserRentModel], { nullable: true, description: 'Resolve user rental history' })
  rents(@Parent() user: UserModel) {
    return (user as any).rents ?? [];
  }

  @Mutation(() => UserModel, { description: 'Register a new user account' })
  registerUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input as any);
  }

  @Mutation(() => UserModel, { description: 'Update user profile information' })
  updateProfile(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.userService.update(id, input as any);
  }

  @Mutation(() => UserModel, { description: 'Delete a user account' })
  deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
