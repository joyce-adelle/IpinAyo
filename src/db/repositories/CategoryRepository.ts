import { EntityRepository, TreeRepository } from "typeorm";
import { CategoryNotRetrieved } from "../dbUtils/DbErrors";
import { Category } from "../entities/Category";
import { CreateCategory } from "../inputInterfaces/CreateCategory";
import { UpdateCategory } from "../inputInterfaces/UpdateCategory";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {
  async createAndSave(category: CreateCategory): Promise<Category> {
    let categoryDet = new Category();
    categoryDet.name = category.name;
    if (category.parentId) {
      const parent = await this.findById(category.parentId);
      if (!CategoryRepository.isCategory(parent))
        throw new CategoryNotRetrieved(category.parentId);
      categoryDet.parent = parent;
    }
    return this.save(categoryDet);
  }

  async findById(id: string): Promise<Category> {
    return this.findOne({ where: { id: id } });
  }

  async findOneByName(name: string): Promise<Category> {
    return this.findOne({ where: { name: name } });
  }

  async findByMusicId(musicId: string): Promise<Category[]> {
    return this.createQueryBuilder("category")
      .leftJoin("category.relatedMusic", "music")
      .where("music.id = :musicId", { musicId: musicId })
      .getMany();
  }

  async findChildren(parent: Category): Promise<Category[]> {
    return this.findDescendants(parent);
  }

  async findDescendantIdsByIds(categoryIds: string[]): Promise<string[]> {
    let allCats: string[] = [];
    if (categoryIds.length !== 0) {
      await this.query(
        "SELECT distinct id_descendant as id FROM category_closure WHERE id_ancestor in (?)",
        [...categoryIds]
      ).then((RowDataPackets) => {
        allCats.push(...RowDataPackets.map((cat: { id: string }) => cat.id));
      });
    }
    return allCats;
  }

  //not a complete solution
  async updateCategory(
    id: string,
    category: UpdateCategory
  ): Promise<Category> {
    let categoryDet = await this.findById(id);
    if (!CategoryRepository.isCategory(categoryDet))
      throw new CategoryNotRetrieved(id);
    if (category.name) {
      categoryDet.name = category.name;
    }
    if (category.parentId || category.parentId === null) {
      if (category.parentId === null) {
        categoryDet.parent = null;
      } else {
        const parent = await this.findById(category.parentId);
        if (!CategoryRepository.isCategory(parent))
          throw new CategoryNotRetrieved(category.parentId);
        categoryDet.parent = parent;
      }

      await this.query(
        `DELETE a FROM category_closure AS a
          JOIN category_closure AS d ON a.id_descendant = d.id_descendant
          LEFT JOIN category_closure AS x
          ON x.id_ancestor = d.id_ancestor AND x.id_descendant = a.id_ancestor
          WHERE d.id_ancestor = ? AND x.id_ancestor IS NULL`,
        [id]
      );

      await this.query(
        `INSERT INTO category_closure (id_ancestor, id_descendant)
          SELECT supertree.id_ancestor, subtree.id_descendant
          FROM category_closure AS supertree JOIN category_closure AS subtree
          WHERE subtree.id_ancestor = ?
          AND supertree.id_descendant = ?`,
        [id, category.parentId]
      );
    }
    return this.save(categoryDet);
  }

  static isCategory(category: any): category is Category {
    return typeof category === "object" && typeof category.name === "string";
  }
}
