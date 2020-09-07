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
@Index("IDX_FULLTEXTPHRASE",{ synchronize: false })
@Index("IDX_3a385ee566ec326b73e79f8025",{ synchronize: false })
export class RelatedPhrases {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @Index({ fulltext: true, unique: true})
  phrase: string;

  @Column({type: 'int'})
  groupId: string;

  @ManyToMany((type) => Music, (relatedMusic) => relatedMusic.relatedPhrases)
  relatedMusic: Music[];

  @RelationId((relatedMusic: RelatedPhrases) => relatedMusic.relatedMusic)
  relatedMusicIds: string[];
}
