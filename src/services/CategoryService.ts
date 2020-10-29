import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserInterface } from "../context/user.interface";
import { CategoryNotRetrieved } from "../db/dbUtils/DbErrors";
import { Category } from "../db/entities/Category";
import { CreateCategory } from "../db/inputInterfaces/CreateCategory";
import { UpdateCategory } from "../db/inputInterfaces/UpdateCategory";
import { CategoryRepository } from "../db/repositories/CategoryRepository";
import { UserRole } from "../utilities/UserRoles";
import {
  CategoryExistsError,
  CategoryNotFoundError,
  UnAuthorizedError,
  UnknownError,
} from "./serviceUtils/errors";
import { MyError } from "./serviceUtils/MyError";

@Service()
export class CategoryService {
  @InjectRepository()
  private readonly categoryRepository: CategoryRepository;

  public async getTreeCategories(): Promise<Category[]> {
    try {
      return this.categoryRepository.findTrees();
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  public async getCategories(): Promise<Category[]> {
    try {
      return this.categoryRepository.find();
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  public async getCategory(id: string): Promise<Category> {
    try {
      const cat = this.categoryRepository.findById(id);
      if (!cat) throw new CategoryNotFoundError(id);
      return cat;
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  public async getChildren(parent: Category){
    return this.categoryRepository.findChildren(parent);
  }

  public async createCategory(
    user: UserInterface,
    data: CreateCategory
  ): Promise<Category> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role === UserRole.User) throw new UnAuthorizedError();
      if (await this.categoryRepository.findOneByName(data.name))
        throw new CategoryExistsError();
      return await this.categoryRepository.createAndSave(data);
    } catch (error) {
      if (error instanceof CategoryNotRetrieved)
        throw new CategoryNotFoundError(data.parentId);
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }

  public async updateCategory(
    user: UserInterface,
    id: string,
    data: UpdateCategory
  ): Promise<Category> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role !== UserRole.Superadmin) throw new UnAuthorizedError();
      if (data.name) {
        if (await this.categoryRepository.findOneByName(data.name))
          throw new CategoryExistsError();
      }
      return await this.categoryRepository.updateCategory(id, data);
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }
}
