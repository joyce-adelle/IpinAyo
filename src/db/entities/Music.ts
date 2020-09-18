import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
} from "typeorm";
import { User } from "./User";
import { ScoreType } from "../../utilities/ScoreType";
import { Category } from "./Category";
import { RelatedPhrases } from "./RelatedPhrases";
import { Field, ID, Int, ObjectType } from "type-graphql";

@Entity()
@Index("IDX_691e99699b0d2dfaaa7a6a83c5", { synchronize: false })
@ObjectType()
export class Music {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({
    nullable: false,
    unique: true,
  })
  score: string;

  @Field(() => String, {nullable: true})
  @Column({
    nullable: true,
  })
  audio: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column({ type: "text" })
  description: string;

  @Field(() => String, {nullable: true})
  @Column({
    nullable: true,
  })
  composers: string;

  @Field(() => String, {nullable: true})
  @Column({ type: "char", nullable: true, length: 4 })
  yearOfComposition: string;

  @Field(() => String, {nullable: true})
  @Column({
    nullable: true,
  })
  arrangers: string;

  @Field(() => String, {nullable: true})
  @Column({ type: "char", nullable: true, length: 4 })
  yearOfArrangement: string;

  @Field(() => [String])
  @Column("simple-array")
  languages: string[];

  @Field(() => ScoreType)
  @Column({
    type: "enum",
    enum: ScoreType,
  })
  scoreType: ScoreType;

  @Field(() => Boolean)
  @Column({ default: false })
  isVerified: boolean;

  @Field(() => Int)
  @Column({ type: "bigint", default: 0 })
  numberOfDownloads: number;

  @ManyToOne((type) => User, (user) => user.uploads)
  uploadedBy: User;

  @Field(() => [Category])
  @ManyToMany((type) => Category, (category) => category.relatedMusic)
  @JoinTable()
  categories: Category[];

  @Field(() => [ID])
  @RelationId((music: Music) => music.categories)
  categoryIds: string[];

  @ManyToMany(
    (type) => RelatedPhrases,
    (relatedPhrases) => relatedPhrases.relatedMusic
  )
  @JoinTable()
  relatedPhrases: RelatedPhrases[];

  @Field(() => [ID])
  @RelationId((music: Music) => music.relatedPhrases)
  relatedPhrasesIds: string[];

  @Field(() => Date)
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  @ManyToOne((type) => User)
  updatedBy: User;

  @Field(() => Date, {nullable: true})
  @Column({
    type: "timestamp",
    nullable: true,
    precision: 6,
  })
  verifiedAt: Date;

  @ManyToOne((type) => User)
  verifiedBy: User;
}
