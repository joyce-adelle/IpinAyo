import { InjectRepository } from "typeorm-typedi-extensions";
import { UserInterface } from "../context/user.interface";
import { MyDbError } from "../db/dbUtils/MyDbError";
import { RelatedPhrases } from "../db/entities/RelatedPhrases";
import { CreateRelatedPhrases } from "../db/inputInterfaces/CreateRelatedPhrases";
import { UpdateRelatedPhrases } from "../db/inputInterfaces/UpdateRelatedPhrases";
import { RelatedPhrasesRepository } from "../db/repositories/RelatedPhrasesRepository";
import { UserRole } from "../utilities/UserRoles";
import {
  CannotBeDeletedError,
  PhraseExistsError,
  PhraseNotFoundError,
  UnAuthorizedError,
} from "./serviceUtils/Errors";

export class RelatedPhrasesService {
  @InjectRepository()
  private readonly relatedPhrasesRepository: RelatedPhrasesRepository;

  public async getAllRelatedPhrases(): Promise<RelatedPhrases[]> {
    return this.relatedPhrasesRepository.find();
  }

  public async getRelatedPhrase(id: string): Promise<RelatedPhrases> {
    const phrase = await this.relatedPhrasesRepository.findRelatedPhraseDetailsById(
      id
    );
    if (!phrase) throw new PhraseNotFoundError(id);
    return phrase;
  }

  public async createRelatedPhrase(
    user: UserInterface,
    data: CreateRelatedPhrases
  ): Promise<RelatedPhrases> {
    if (!user) throw new UnAuthorizedError();
    if (user.role === UserRole.User) throw new UnAuthorizedError();
    if (await this.relatedPhrasesRepository.findOneByPhrase(data.phrase))
      throw new PhraseExistsError();
    return this.relatedPhrasesRepository.createAndSave(data);
  }

  public async updateRelatedPhrases(
    user: UserInterface,
    id: string,
    data: UpdateRelatedPhrases
  ): Promise<RelatedPhrases> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role === UserRole.User) throw new UnAuthorizedError();
      if (data.phrase) {
        if (await this.relatedPhrasesRepository.findOneByPhrase(data.phrase))
          throw new PhraseExistsError();
      }
      return await this.relatedPhrasesRepository.updateRelatedPhrases(id, data);
    } catch (error) {
      if (error instanceof MyDbError) throw new PhraseNotFoundError(id);
      throw error;
    }
  }

  public async deleteRelatedPhrase(
    user: UserInterface,
    id: string
  ): Promise<boolean> {
    try {
      if (!user) throw new UnAuthorizedError();
      if (user.role === UserRole.User) throw new UnAuthorizedError();
      const del = await this.relatedPhrasesRepository.deleteRelatedPhrase(id);
      if (!del) throw new CannotBeDeletedError();
      return del;
    } catch (error) {
      if (error instanceof MyDbError) throw new PhraseNotFoundError(id);
      throw error;
    }
  }
}
