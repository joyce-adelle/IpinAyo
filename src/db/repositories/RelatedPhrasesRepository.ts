import { EntityRepository, Repository, Like } from "typeorm";
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

  async allRelatedPhrases(): Promise<RelatedPhrases[]> {
    let relatedPhrases = await this.find({ loadRelationIds: true });
    return relatedPhrases;
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

  async findRelatedMusicIdsByPhrase(phrase: string): Promise<string[]> {
    let relatedRels: RelatedPhrases[] = [];
    let rel = await this.find({
      where: { phrase: Like(`%${phrase.trim()}%`) },
    });
    for (let key of rel) {
      relatedRels.push(
        await this.findOne({
          where: { groupId: key.groupId },
        })
      );
    }
    let musicIds: string[] = [];
    for (let key of relatedRels) {
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
      throw new Error(error.message);
    }
  }

  static isRelatedPhrases(
    relatedPhrases: any
  ): relatedPhrases is RelatedPhrases {
    return (
      typeof relatedPhrases === "object" &&
      typeof relatedPhrases.phrase === "string" &&
      typeof relatedPhrases.groupId === "string"
    );
  }
}
