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
    let newRelatedPhrases = await this.save(relatedPhrasesDet);
    return newRelatedPhrases;
  }

  async findRelatedPhraseDetailsById(id: string): Promise<RelatedPhrases> {
    let relatedPhrases = await this.findOne({
      where: { id: id },
    });
    if (!RelatedPhrasesRepository.isRelatedPhrases(relatedPhrases)) {
      throw new Error(
        `RelatedPhrases' id ${util.inspect(
          id
        )} did not retrieve a RelatedPhrase`
      );
    }
    return relatedPhrases;
  }

  async findRelatedPhrasesByPhrase(phrase: string): Promise<RelatedPhrases[]> {
    let obj = await this.findOne({ where: { phrase: phrase } });

    if (!RelatedPhrasesRepository.isRelatedPhrases(obj)) {
      throw new Error(
        `RelatedPhrases' phrase ${util.inspect(
          phrase
        )} did not retrieve a RelatedPhrase`
      );
    } else {
      let rel = await this.find({
        where: { groupId: obj.groupId },
      });
      return rel;
    }
  }

  async findRelatedPhrasesById(id: string): Promise<RelatedPhrases[]> {
    let obj = await this.findOne({ where: { id: id } });

    if (!RelatedPhrasesRepository.isRelatedPhrases(obj)) {
      throw new Error(
        `RelatedPhrases' id ${util.inspect(
          id
        )} did not retrieve a RelatedPhrase`
      );
    } else {
      let rel = await this.find({
        where: { groupId: obj.groupId },
      });
      return rel;
    }
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
    try {
      let relatedPhrasesDet = await this.findRelatedPhraseDetailsById(id);
      Object.assign(relatedPhrasesDet, relatedPhrases);
      let updatedRelatedPhrases = await this.save(relatedPhrasesDet);
      return updatedRelatedPhrases;
    } catch (error) {
      throw error;
    }
  }

  async deleteRelatedPhrase(id: string): Promise<boolean> {
    try {
      let phrase = await this.findRelatedPhraseDetailsById(id);
      if (phrase.relatedMusicIds.length === 0) {
        await this.delete(id);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
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
