import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { CategoryRepository } from "../../db/repositories/CategoryRepository";
import { Category } from "../../db/entities/Category";
import { CreateCategoryInput } from '../inputs/CreateCategory.input';
import { UpdateCategoryInput } from '../inputs/UpdateCategory.input';


@Resolver()
export class CategoryResolver {
  private categoryRepository = getCustomRepository(CategoryRepository);

  @Query(() => [Category])
  treeCategories() {
    return this.categoryRepository.findTrees()
  }

  @Query(() => [Category])
  categories() {
    return this.categoryRepository.find()
  }

  @Query(() => Category)
  category(@Arg("id") id: string) {
    return this.categoryRepository.findCategoryById(id);
  }

  @Mutation(() => Category)
  async createCategory(@Arg("data") data: CreateCategoryInput) {
    let category = await this.categoryRepository.createAndSave(data);
    return category;
  }

  @Mutation(() => Category)
  async updateCategory(@Arg("id") id: string, @Arg("data") data: UpdateCategoryInput) {
    let category = await this.categoryRepository.updateCategory(id, data);
    return category;
  }
}
