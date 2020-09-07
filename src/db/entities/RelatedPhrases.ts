import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  RelationId,
  Index,
} from "typeorm";
import { Music } from "./Music";

@Entity()
@Index("IDX_FULLTEXTPHRASE", { synchronize: false })
export class RelatedPhrases {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  phrase: string;

  @Column({ type: "int" })
  groupId: string;

  @ManyToMany((type) => Music, (relatedMusic) => relatedMusic.relatedPhrases)
  relatedMusic: Music[];

  @RelationId((relatedMusic: RelatedPhrases) => relatedMusic.relatedMusic)
  relatedMusicIds: string[];
}
