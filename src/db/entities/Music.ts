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

@Entity()
@Index("IDX_691e99699b0d2dfaaa7a6a83c5", { synchronize: false })
export class Music {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  score: string;

  @Column({
    nullable: true,
  })
  audio: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({
    nullable: true,
  })
  composers: string;

  @Column({ type: "char", nullable: true, length: 4 })
  yearOfComposition: string;

  @Column({
    nullable: true,
  })
  arrangers: string;

  @Column({ type: "char", nullable: true, length: 4 })
  yearOfArrangement: string;

  @Column("simple-array")
  languages: string[];

  @Column({
    type: "enum",
    enum: ScoreType,
  })
  scoreType: ScoreType;

  @Column({ default: false })
  isVerified: boolean;

  @Column()
  numberOfDownloads: number;

  @ManyToOne((type) => User, (user) => user.uploads)
  uploadedBy: User;

  @ManyToMany((type) => Category, (category) => category.relatedMusic)
  @JoinTable()
  categories: Category[];

  @ManyToMany(
    (type) => RelatedPhrases,
    (relatedPhrases) => relatedPhrases.relatedMusic
  )
  @JoinTable()
  relatedPhrases: RelatedPhrases[];

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

  @ManyToOne((type) => User)
  updatedBy: User;

  @Column({
    type: "timestamp",
    nullable: true,
    precision: 6,
  })
  verifiedAt: Date;

  @ManyToOne((type) => User)
  verifiedBy: User;

  scoreFile: File;

  audioFile: File;
}
