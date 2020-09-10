import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  RelationId,
  Index,
} from "typeorm";
import { Music } from "./Music";
import { ObjectType, Field } from 'type-graphql';
@ObjectType()
@Entity()
@Index("IDX_FULLTEXTPHRASE", { synchronize: false })
export class RelatedPhrases {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  phrase: string;

  @Field(() => String)
  @Column({ type: "int" })
  groupId: string;

  @ManyToMany((type) => Music, (relatedMusic) => relatedMusic.relatedPhrases)
  relatedMusic: Music[];

  @Field(() => [String])
  @RelationId((relatedMusic: RelatedPhrases) => relatedMusic.relatedMusic)
  relatedMusicIds: string[];
}
