import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CategoryRepository } from "../db/repositories/CategoryRepository";
import { MusicRepository } from "../db/repositories/MusicRepository";
import { UnknownError } from "./serviceUtils/errors";
import { MyError } from "./serviceUtils/MyError";
import { MusicArray } from "./serviceUtils/subEntities/MusicArray";

@Service()
export class SearchService {
  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  @InjectRepository()
  private readonly categoryRepository: CategoryRepository;

  async filterByQuery(
    query: string,
    selectedCategoryIds?: string[],
    exactCategories?: boolean,
    limit: number = 20,
    page: number = 1
  ): Promise<MusicArray> {
    try {
      if (selectedCategoryIds) {
        if (selectedCategoryIds.length === 0) {
          if (query) {
            const [music, totalCount] = await this.musicRepository.findByQuery(
              query
            );
            return Object.assign(new MusicArray(), { music, totalCount });
          }
          const [music, totalCount] = await this.musicRepository.all(
            limit,
            (page - 1) * limit
          );
          return Object.assign(new MusicArray(), { music, totalCount });
        } else {
          if (exactCategories) {
            if (query) {
              const [
                music,
                totalCount,
              ] = await this.musicRepository.findByQueryAndExactCategoryIds(
                query,
                selectedCategoryIds,
                limit,
                (page - 1) * limit
              );
              return Object.assign(new MusicArray(), { music, totalCount });
            }
            const [
              music,
              totalCount,
            ] = await this.musicRepository.findByExactCategoryIds(
              selectedCategoryIds,
              limit,
              (page - 1) * limit
            );
            return Object.assign(new MusicArray(), { music, totalCount });
          } else {
            const desc = await this.categoryRepository.findDescendantIdsByIds(
              selectedCategoryIds
            );
            if (query) {
              const [
                music,
                totalCount,
              ] = await this.musicRepository.findByQueryAndCategoryIds(
                query,
                desc,
                limit,
                (page - 1) * limit
              );
              return Object.assign(new MusicArray(), { music, totalCount });
            }
            const [
              music,
              totalCount,
            ] = await this.musicRepository.findByCategoryIds(
              desc,
              limit,
              (page - 1) * limit
            );
            return Object.assign(new MusicArray(), { music, totalCount });
          }
        }
      }

      if (query && !selectedCategoryIds) {
        const [music, totalCount] = await this.musicRepository.findByQuery(
          query,
          limit,
          (page - 1) * limit
        );
        return Object.assign(new MusicArray(), { music, totalCount });
      }

      const [music, totalCount] = await this.musicRepository.all(
        limit,
        (page - 1) * limit
      );
      return Object.assign(new MusicArray(), { music, totalCount });
    } catch (error) {
      if (error instanceof MyError) throw error;

      console.log(error);
      throw new UnknownError();
    }
  }
}
