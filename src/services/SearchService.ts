import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Music } from "../db/entities/Music";
import { CategoryRepository } from "../db/repositories/CategoryRepository";
import { MusicRepository } from "../db/repositories/MusicRepository";
import { UnknownError } from "./serviceUtils/errors";
import { MyError } from './serviceUtils/MyError';

@Service()
export class SearchService {
  @InjectRepository()
  private readonly musicRepository: MusicRepository;

  @InjectRepository()
  private readonly categoryRepository: CategoryRepository;

  async filterByQuery(query: string): Promise<Music[]>;
  async filterByQuery(
    query: string,
    selectedCategoryIds: string[],
    exactCategories?: boolean
  ): Promise<Music[]>;

  async filterByQuery(
    query: string,
    selectedCategoryIds?: string[],
    exactCategories?: boolean
  ): Promise<Music[]> {
    try {
      if (selectedCategoryIds) {
        if (selectedCategoryIds.length === 0) {
          if (query) return this.musicRepository.findByQuery(query);
          return this.musicRepository.all();
        } else {
          if (exactCategories) {
            if (query)
              return this.musicRepository.findByQueryAndExactCategoryIds(
                query,
                selectedCategoryIds
              );
            return this.musicRepository.findByExactCategoryIds(
              selectedCategoryIds
            );
          } else {
            const desc = await this.categoryRepository.findDescendantIdsByIds(
              selectedCategoryIds
            );
            console.log("heeere", desc)
            if (query)
              return this.musicRepository.findByQueryAndCategoryIds(
                query,
                desc
              );
            return this.musicRepository.findByCategoryIds(desc);
          }
        }
      }

      if (query && !selectedCategoryIds)
        return this.musicRepository.findByQuery(query);

      return this.musicRepository.all();
    } catch (error) {
      if (error instanceof MyError) throw error;
      
      console.log(error);
      throw new UnknownError();
    }
  }
}
