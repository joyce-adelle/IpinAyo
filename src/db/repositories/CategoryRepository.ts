import { EntityRepository, TreeRepository, getConnection } from "typeorm";
import * as util from "util";
import { Category } from "../entities/Category";
import { CreateCategory } from "../inputInterfaces/CreateCategory";
import { UpdateCategory } from "../inputInterfaces/UpdateCategory";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {
  async createAndSave(category: CreateCategory): Promise<Category> {
    try {
      let categoryDet = new Category();
      categoryDet.name = category.name;
      if (category.parentId) {
        categoryDet.parent = await this.findCategoryById(category.parentId);
      }
      let newCategory = await this.save(categoryDet);
      return newCategory;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async allCategories(): Promise<Category[]> {
    let categories = await this.findTrees();
    return categories;
  }

  async findCategoryById(id: string): Promise<Category> {
    let obj = await this.findOne({ where: { id: id } });

    if (!CategoryRepository.isCategory(obj)) {
      throw new Error(
        `Category' id ${util.inspect(id)} did not retrieve a Category`
      );
    }
    return obj;
  }

  async findRelatedMusicIdsByCategoryId(categoryId: string): Promise<string[]> {
    try {
      let rel = await this.findCategoryById(categoryId);
      let relatedRels = await this.findDescendants(rel);

      let musicIds: string[] = [];
      for (let key of relatedRels) {
        musicIds.push(...key.relatedMusicIds);
      }
      return [...new Set(musicIds)];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //not a complete solution
  async updateCategory(
    id: string,
    category: UpdateCategory
  ): Promise<Category> {
    try {
      let categoryDet = await this.findCategoryById(id);
      if (category.name) {
        categoryDet.name = category.name;
      }
      if (category.parentId) {
        if (category.parentId.toLowerCase() === "null") {
          categoryDet.parent = null;
        } else {
          categoryDet.parent = await this.findCategoryById(category.parentId);
        }

        await getConnection().query(
          `DELETE a FROM category_closure AS a
          JOIN category_closure AS d ON a.id_descendant = d.id_descendant
          LEFT JOIN category_closure AS x
          ON x.id_ancestor = d.id_ancestor AND x.id_descendant = a.id_ancestor
          WHERE d.id_ancestor = ${id} AND x.id_ancestor IS NULL`
        );

        await getConnection().query(
          `INSERT INTO category_closure (id_ancestor, id_descendant)
          SELECT supertree.id_ancestor, subtree.id_descendant
          FROM category_closure AS supertree JOIN category_closure AS subtree
          WHERE subtree.id_ancestor = ${id}
          AND supertree.id_descendant = ${category.parentId}`
        );
      }
      let updatedCategory = await this.save(categoryDet);
      return updatedCategory;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static isCategory(category: any): category is Category {
    return typeof category === "object" && typeof category.name === "string";
  }
}
