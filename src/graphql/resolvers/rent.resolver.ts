import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../auth/decorators/current-user.decorator';
import { RentService } from '../../rent/rent.service';
import { RentType } from '../types/rent.type';
import { CreateRentInput, UpdateRentInput } from '../inputs/rent.input';

@Resolver(() => RentType)
export class RentResolver {
  constructor(private readonly rentService: RentService) {}

  @Roles(Role.ADMIN)
  @Query(() => [RentType])
  async rents(): Promise<RentType[]> {
    return this.rentService.findAll({});
  }

  @Query(() => RentType)
  async rent(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<RentType> {
    const rent = await this.rentService.findOne(id);
    if (currentUser.role !== Role.ADMIN && rent.userId !== currentUser.sub) {
      throw new ForbiddenException('Access denied');
    }
    return rent;
  }

  @Mutation(() => RentType)
  createRent(
    @Args('input') input: CreateRentInput,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<RentType> {
    if (currentUser.role !== Role.ADMIN && input.userId !== currentUser.sub) {
      throw new ForbiddenException('Access denied');
    }
    return this.rentService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => RentType)
  updateRent(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateRentInput,
  ): Promise<RentType> {
    return this.rentService.update(id, input);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteRent(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.rentService.remove(id);
    return true;
  }
}
