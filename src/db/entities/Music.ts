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
} from "typeorm";
import { User } from "./User";
import { ScoreType } from "../../utilities/ScoreType";
import { Category } from "./Category";
import { RelatedPhrases } from "./RelatedPhrases";
import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
@Index("IDX_691e99699b0d2dfaaa7a6a83c5", { synchronize: false })
export class Music {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Field(() => String)
  @Column({
    nullable: false,
    unique: true,
  })
  score: string;

  @Field(() => String, { nullable: true })
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

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
  })
  composers: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "char", nullable: true, length: 4 })
  yearOfComposition: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
  })
  arrangers: string;

  @Field(() => String, { nullable: true })
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

  @Column({ default: false })
  isVerified: boolean;

  @Field(() => Int)
  numberOfDownloads: number;

  @Field(() => [Category])
  @ManyToMany(() => Category, (category) => category.relatedMusic)
  @JoinTable()
  categories: Category[];

  @Field(() => [RelatedPhrases])
  @ManyToMany(
    () => RelatedPhrases,
    (relatedPhrases) => relatedPhrases.relatedMusic
  )
  @JoinTable()
  relatedPhrases: RelatedPhrases[];

  @ManyToMany(() => User, (user) => user.downloads)
  downloadedBy: User[];

  @ManyToOne(() => User, (user) => user.uploads)
  uploadedBy: User;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  @ManyToOne(() => User)
  updatedBy: User;

  @Column({
    type: "timestamp",
    nullable: true,
    precision: 6,
  })
  verifiedAt: Date;

  @ManyToOne(() => User)
  verifiedBy: User;
}
