import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserInterface } from "../context/user.interface";
import { MyDbError } from "../db/dbUtils/MyDbError";
import { Category } from "../db/entities/Category";
import { CreateCategory } from "../db/inputInterfaces/CreateCategory";
import { UpdateCategory } from "../db/inputInterfaces/UpdateCategory";
import { CategoryRepository } from "../db/repositories/CategoryRepository";
import { UserRole } from "../utilities/UserRoles";
import {
  CategoryExistsError,
  CategoryNotFoundError,
  UnAuthorizedError,
} from "./serviceUtils/errors";
import { MyError } from './serviceUtils/MyError';

@Service()
export class CategoryService {
  @InjectRepository()
  private readonly categoryRepository: CategoryRepository;

  public async getTreeCategories(): Promise<Category[]> {
    return this.categoryRepository.findTrees();
  }

  public async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  public async getCategory(id: string): Promise<Category> {
    const cat =  this.categoryRepository.findCategoryById(id);
    if(!cat) throw new CategoryNotFoundError(id);
    return cat;
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
      if (error instanceof MyDbError)
        throw new CategoryNotFoundError(data.parentId);
      throw error;
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
      if (error instanceof MyDbError)
        throw new MyError(error.message);
      throw error;
    }
  }
}
