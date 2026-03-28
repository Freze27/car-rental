import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../auth/decorators/current-user.decorator';
import { UserService } from '../../user/user.service';
import { UserType } from '../types/user.type';
import { UpdateUserInput } from '../inputs/user.input';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType)
  me(@CurrentUser() user: JwtPayload): Promise<UserType> {
    return this.userService.findOne(user.sub);
  }

  @Roles(Role.ADMIN)
  @Query(() => [UserType])
  users(): Promise<UserType[]> {
    return this.userService.findAll();
  }

  @Query(() => UserType)
  async user(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<UserType> {
    if (currentUser.role !== Role.ADMIN && currentUser.sub !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.findOne(id);
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<UserType> {
    if (currentUser.role !== Role.ADMIN && currentUser.sub !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.update(id, input);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.userService.remove(id);
    return true;
  }
}
