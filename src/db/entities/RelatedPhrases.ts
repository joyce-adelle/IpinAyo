import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  RelationId,
  Index,
} from "typeorm";
import { Music } from "./Music";
import { ObjectType, Field, ID } from 'type-graphql';
@ObjectType()
@Entity()
@Index("IDX_FULLTEXTPHRASE", { synchronize: false })
export class RelatedPhrases {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Field(() => String)
  @Column({ unique: true })
  phrase: string;

  @Field(() => String)
  @Column({ type: "int" })
  groupId: string;

  @ManyToMany((type) => Music, (relatedMusic) => relatedMusic.relatedPhrases)
  relatedMusic: Music[];

  @Field(() => [ID])
  @RelationId((relatedMusic: RelatedPhrases) => relatedMusic.relatedMusic)
  relatedMusicIds: string[];
}
