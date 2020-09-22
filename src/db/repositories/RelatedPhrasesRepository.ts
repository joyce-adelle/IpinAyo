import { EntityRepository, Repository } from "typeorm";
import * as util from "util";
import { RelatedPhrases } from "../entities/RelatedPhrases";
import { CreateRelatedPhrases } from "../inputInterfaces/CreateRelatedPhrases";
import { UpdateRelatedPhrases } from "../inputInterfaces/UpdateRelatedPhrases";

@EntityRepository(RelatedPhrases)
export class RelatedPhrasesRepository extends Repository<RelatedPhrases> {
  async createAndSave(
    relatedPhrases: CreateRelatedPhrases
  ): Promise<RelatedPhrases> {
    let relatedPhrasesDet = new RelatedPhrases();
    Object.assign(relatedPhrasesDet, relatedPhrases);
    return this.save(relatedPhrasesDet);
  }

  async findRelatedPhraseDetailsById(id: string): Promise<RelatedPhrases> {
    return this.findOne({
      where: { id: id },
    });
  }

  async findOneByPhrase(phrase: string): Promise<RelatedPhrases> {
    return this.findOne({ where: { phrase: phrase } });
  }

  async findRelatedPhrasesByPhrase(phrase: string): Promise<RelatedPhrases[]> {
    let obj = await this.findOneByPhrase(phrase);

    if (!RelatedPhrasesRepository.isRelatedPhrases(obj)) {
      throw new Error(
        `RelatedPhrases' phrase ${util.inspect(
          phrase
        )} did not retrieve a RelatedPhrase`
      );
    }
    return this.find({
      where: { groupId: obj.groupId },
    });
  }

  async findRelatedPhrasesById(id: string): Promise<RelatedPhrases[]> {
    let obj = await this.findRelatedPhraseDetailsById(id);

    if (!RelatedPhrasesRepository.isRelatedPhrases(obj)) {
      throw new Error(
        `RelatedPhrases' id ${util.inspect(
          id
        )} did not retrieve a RelatedPhrase`
      );
    }
    return this.find({
      where: { groupId: obj.groupId },
    });
  }

  async findRelatedMusicIdsByQuery(query: string): Promise<string[]> {
    const result = await this.createQueryBuilder()
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("relatedPhrases.groupId")
          .from(RelatedPhrases, "relatedPhrases")
          .where("MATCH(phrase) AGAINST (:query IN BOOLEAN MODE)", {
            query: query.trim(),
          })
          .getQuery();
        return "groupId IN " + subQuery;
      })
      .orderBy("groupId")
      .getMany();

    let musicIds: string[] = [];
    for (let key of result) {
      musicIds.push(...key.relatedMusicIds);
    }
    return [...new Set(musicIds)];
  }

  async updateRelatedPhrases(
    id: string,
    relatedPhrases: UpdateRelatedPhrases
  ): Promise<RelatedPhrases> {
    let relatedPhrasesDet = await this.findRelatedPhraseDetailsById(id);
    if (!RelatedPhrasesRepository.isRelatedPhrases(relatedPhrasesDet)) {
      throw new Error(
        `RelatedPhrases' id ${util.inspect(
          id
        )} did not retrieve a RelatedPhrase`
      );
    }
    Object.assign(relatedPhrasesDet, relatedPhrases);
    return this.save(relatedPhrasesDet);
  }

  async deleteRelatedPhrase(id: string): Promise<boolean> {
    let phrase = await this.findRelatedPhraseDetailsById(id);
    if (!RelatedPhrasesRepository.isRelatedPhrases(phrase)) {
      throw new Error(
        `RelatedPhrases' id ${util.inspect(
          id
        )} did not retrieve a RelatedPhrase`
      );
    }
    if (phrase.relatedMusicIds.length === 0) {
      await this.delete(id);
      return true;
    }
    return false;
  }

  static isRelatedPhrases(
    relatedPhrases: any
  ): relatedPhrases is RelatedPhrases {
    return (
      typeof relatedPhrases === "object" &&
      typeof relatedPhrases.phrase === "string"
    );
  }
}
