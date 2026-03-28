import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { CategoryService } from '../../category/category.service';
import { CategoryType } from '../types/category.type';

@Resolver(() => CategoryType)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Query(() => [CategoryType])
  categories(): Promise<CategoryType[]> {
    return this.categoryService.findAll();
  }

  @Roles(Role.ADMIN)
  @Mutation(() => CategoryType)
  createCategory(@Args('name') name: string): Promise<CategoryType> {
    return this.categoryService.create({ name });
  }

  @Roles(Role.ADMIN)
  @Mutation(() => CategoryType)
  updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ): Promise<CategoryType> {
    return this.categoryService.update(id, { name });
  }
}
