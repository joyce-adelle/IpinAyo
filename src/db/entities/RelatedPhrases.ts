import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  RelationId,
} from "typeorm";
import { Music } from "./Music";

@Entity()
export class RelatedPhrases {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  phrase: string;

  @Column()
  groupId: string;

  @ManyToMany((type) => Music, (relatedMusic) => relatedMusic.relatedPhrases)
  relatedMusic: Music[];

  @RelationId((relatedMusic: RelatedPhrases) => relatedMusic.relatedMusic)
  relatedMusicIds: string[];
}
