import { EntityRepository, Repository, Like } from "typeorm";
import * as util from "util";
import { Music } from "../entities/Music";
import { CreateMusic } from "../inputInterfaces/CreateMusic";
import { UpdateMusic } from "../inputInterfaces/UpdateMusic";

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  async createAndSave(music: CreateMusic): Promise<Music> {
    let musicDet = new Music();
    Object.assign(musicDet, music);
    let newMusic = await this.save(musicDet);
    return newMusic;
  }

  async allMusic(): Promise<Music[]> {
    let music = await this.find({where: {isVerified: true}});
    return music;
  }

  async allUnverifiedMusicDetails(): Promise<Music[]> {
    let music = await this.find({where: {isVerified: false}});
    return music;
  }

  async findMusicDetailsById(id: string): Promise<Music> {
    let music = await this.findOne({
      where: { id: id },
      relations: ["categories", "relatedPhrases", "uploadedBy"]
    });
    if (!MusicRepository.isMusic(music)) {
      throw new Error(
        `Music' id ${util.inspect(id)} did not retrieve a RelatedPhrase`
      );
    }
    return music;
  }

  async findMusicById(id: string): Promise<Music> {
    let obj = await this.findOne({ where: { id: id } });

    if (!MusicRepository.isMusic(obj)) {
      throw new Error(
        `Music' id ${util.inspect(id)} did not retrieve a RelatedPhrase`
      );
    }
    return obj;
  }

  async findRelatedMusicIdsByPhrase(phrase: string): Promise<string[]> {
    let relatedRels: Music[] = [];
    let rel = await this.find({
      where: { title: Like(`%${phrase.trim()}%`) },
    });
    
    let musicIds: string[] = [];
    for (let key of rel) {
      musicIds.push(...key.id);
    }
    return [...new Set(musicIds)];
  }

  async updateMusic(id: string, music: UpdateMusic): Promise<Music> {
    try {
      let musicDet = await this.findMusicById(id);
      Object.assign(musicDet, music);
      let updatedMusic = await this.save(musicDet);
      return updatedMusic;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static isMusic(music: any): music is Music {
    return (
      typeof music === "object" &&
      typeof music.title === "string" 
    );
  }
}
