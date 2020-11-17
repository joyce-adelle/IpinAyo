import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from "typeorm";
import { Music } from "./Music";
import { ObjectType, Field, ID, Authorized } from "type-graphql";
import { UserRole } from "../../utilities/UserRoles";
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
  @Authorized<UserRole>(UserRole.Admin, UserRole.Superadmin)
  @Column({ type: "int" })
  groupId: string;

  @ManyToMany(() => Music, (relatedMusic) => relatedMusic.relatedPhrases)
  relatedMusic: Music[];

  relatedMusicCount: number;
}
