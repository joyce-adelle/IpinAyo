import { EntityRepository, Repository } from "typeorm";
import { RelatedPhraseNotRetrieved } from "../dbUtils/DbErrors";
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

  async all(
    take: number = 20,
    skip: number = 0
  ): Promise<[RelatedPhrases[], number]> {
    return this.findAndCount({ skip: skip, take: take });
  }

  async findOneById(id: string): Promise<RelatedPhrases> {
    return this.findOne({
      where: { id: id },
    });
  }

  async findOneByPhrase(phrase: string): Promise<RelatedPhrases> {
    return this.findOne({ where: { phrase: phrase } });
  }

  async findOneByGroupId(groupId: string): Promise<RelatedPhrases> {
    return this.findOne({ where: { groupId: groupId } });
  }

  async findByPhrase(
    phrase: string,
    take: number = 20,
    skip: number = 0
  ): Promise<[RelatedPhrases[], number]> {
    let obj = await this.findOneByPhrase(phrase);

    if (!RelatedPhrasesRepository.isRelatedPhrases(obj))
      throw new RelatedPhraseNotRetrieved(phrase);

    return this.findAndCount({
      where: { groupId: obj.groupId },
      skip: skip,
      take: take,
    });
  }

  async findById(
    id: string,
    take: number = 20,
    skip: number = 0
  ): Promise<[RelatedPhrases[], number]> {
    let obj = await this.findOneById(id);

    if (!RelatedPhrasesRepository.isRelatedPhrases(obj))
      throw new RelatedPhraseNotRetrieved(id);

    return this.findAndCount({
      where: { groupId: obj.groupId },
      skip: skip,
      take: take,
    });
  }

  async findByMusicId(
    musicId: string,
    take: number = 20,
    skip: number = 0
  ): Promise<[RelatedPhrases[], number]> {
    return this.createQueryBuilder("relatedPhrases")
      .leftJoin("relatedPhrases.relatedMusic", "music")
      .where("music.id = :musicId", { musicId: musicId })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async updateRelatedPhrases(
    id: string,
    relatedPhrases: UpdateRelatedPhrases
  ): Promise<RelatedPhrases> {
    let relatedPhrasesDet = await this.findOneById(id);
    if (!RelatedPhrasesRepository.isRelatedPhrases(relatedPhrasesDet))
      throw new RelatedPhraseNotRetrieved(id);

    Object.assign(relatedPhrasesDet, relatedPhrases);
    return this.save(relatedPhrasesDet);
  }

  async deleteRelatedPhrase(id: string): Promise<boolean> {
    const relatedPhrasesDet = await this.createQueryBuilder("phrase")
      .loadRelationCountAndMap(
        "phrase.relatedMusicCount",
        "phrase.relatedMusic"
      )
      .where("id = :id", { id: id })
      .getOne();
    if (!RelatedPhrasesRepository.isRelatedPhrases(relatedPhrasesDet))
      throw new RelatedPhraseNotRetrieved(id);
    if (relatedPhrasesDet.relatedMusicCount === 0) {
      await this.delete({ id: id });
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
