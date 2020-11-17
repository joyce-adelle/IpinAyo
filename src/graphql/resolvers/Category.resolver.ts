import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Args,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";
import { Inject } from "typedi";
import { Context } from "../../context/context.interface";
import { Category } from "../../db/entities/Category";
import { CategoryService } from "../../services/CategoryService";
import { MyError } from "../../services/serviceUtils/MyError";
import {
  CategoriesPayload,
  CategoryPayload,
} from "../../services/serviceUtils/Payloads";
import { UserError } from "../../utilities/genericTypes";
import { UserRole } from "../../utilities/UserRoles";
import { IdArgs } from "../arguments/id.args";
import { CreateCategoryInput } from "../inputs/CreateCategory.input";
import { UpdateCategoryInput } from "../inputs/UpdateCategory.input";

@Resolver(Category)
export class CategoryResolver {
  @Inject()
  private readonly categoryService: CategoryService;

  @Query(() => CategoriesPayload)
  async allCategories() {
    try {
      return await this.categoryService.getAllCategories();
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Query(() => CategoriesPayload)
  async rootCategories() {
    try {
      return await this.categoryService.getRootCategories();
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Query(() => CategoryPayload)
  async category(@Args() { id }: IdArgs) {
    try {
      return await this.categoryService.getCategory(id);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Authorized<UserRole>(UserRole.Admin, UserRole.Superadmin)
  @Mutation(() => CategoryPayload)
  async createCategory(
    @Ctx() { user }: Context,
    @Arg("data") data: CreateCategoryInput
  ) {
    try {
      return await this.categoryService.createCategory(user, data);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Authorized<UserRole>(UserRole.Superadmin)
  @Mutation(() => CategoryPayload)
  async updateCategory(
    @Ctx() { user }: Context,
    @Args() { id }: IdArgs,
    @Arg("data") data: UpdateCategoryInput
  ) {
    try {
      return await this.categoryService.updateCategory(user, id, data);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @FieldResolver()
  async children(@Root() parent: Category) {
    return await this.categoryService.getChildren(parent.id);
  }
}
