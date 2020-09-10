import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { RelatedPhrasesRepository } from "../../db/repositories/RelatedPhrasesRepository";
import { RelatedPhrases } from "../../db/entities/RelatedPhrases";
import { CreateRelatedPhrasesInput } from "../inputs/CreateRelatedPhrases.input";
import { UpdateRelatedPhrasesInput } from "../inputs/UpdateRelatedPhrases.input";

@Resolver()
export class RelatedPhrasesResolver {
  private relatedPhrasesRepository = getCustomRepository(RelatedPhrasesRepository);

  @Query(() => [RelatedPhrases])
  relatedPhrases() {
    return this.relatedPhrasesRepository.find();
  }

  @Query(() => RelatedPhrases)
  relatedPhrase(@Arg("id") id: string) {
    return this.relatedPhrasesRepository.findRelatedPhraseDetailsById(id);
  }

  @Mutation(() => RelatedPhrases)
  async createRelatedPhrases(@Arg("data") data: CreateRelatedPhrasesInput) {
    let relatedPhrases = await this.relatedPhrasesRepository.createAndSave(data);
    return relatedPhrases;
  }

  @Mutation(() => RelatedPhrases)
  async updateRelatedPhrases(@Arg("id") id: string, @Arg("data") data: UpdateRelatedPhrasesInput) {
    let relatedPhrases = await this.relatedPhrasesRepository.updateRelatedPhrases(id, data);
    return relatedPhrases;
  }

  @Mutation(() => Boolean)
  async deleteRelatedPhrase(@Arg("id") id: string) {
    const del = await this.relatedPhrasesRepository.deleteRelatedPhrase(id);
    if (!del) throw new Error("Phrase cannot be deleted!");
    return del;
  }
}
