import { EntityRepository, Repository, Like, TreeRepository } from "typeorm";
import * as util from "util";
import { Category } from "../entities/Category";
import { CreateCategory } from "../inputInterfaces/CreateCategory";
import { UpdateCategory } from "../inputInterfaces/UpdateCategory";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {
  async createAndSave(category: CreateCategory): Promise<Category> {
    let categoryDet = new Category();
    Object.assign(categoryDet, category);
    let newCategory = await this.save(categoryDet);
    return newCategory;
  }

  async allCategories(): Promise<Category[]> {
    let category = await this.findTrees();
    return category;
  }

  async findCategoryById(id: string): Promise<Category> {
    let obj = await this.findOne({ where: { id: id } });

    if (!CategoryRepository.isCategory(obj)) {
      throw new Error(
        `Category' id ${util.inspect(id)} did not retrieve a RelatedPhrase`
      );
    }
    return obj;
  }

  //   async findRelatedMusicIdsByPhrase(phrase: string): Promise<string[]> {
  //     let relatedRels: Category[] = [];
  //     let rel = await this.find({
  //       where: { phrase: Like(`%${phrase.trim()}%`) },
  //     });
  //     for (let key of rel) {
  //       relatedRels.push(
  //         await this.findOne({
  //           where: { groupId: key.groupId },
  //         })
  //       );
  //     }
  //     let musicIds: string[] = [];
  //     for (let key of relatedRels) {
  //       musicIds.push(...key.relatedMusicIds);
  //     }
  //     return [...new Set(musicIds)];
  //   }

  async updateCategory(
    id: string,
    category: UpdateCategory
  ): Promise<Category> {
    try {
      let categoryDet = await this.findCategoryById(id);
      Object.assign(categoryDet, category);
      let updatedCategory = await this.save(categoryDet);
      return updatedCategory;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static isCategory(category: any): category is Category {
    return (
      typeof category === "object" &&
      typeof category.name === "string" 
    );
  }
}
