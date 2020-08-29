import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { ScoreType } from "../../utilities/ScoreType";
import { Category } from "./Category";
import { RelatedPhrases } from "./RelatedPhrases";

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
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
  composerName: string;

  @Column({ type: "year", nullable: true })
  yearOfComposition: string;

  @Column({
    nullable: true,
  })
  arrangerName: string;

  @Column({ type: "year", nullable: true })
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

  @CreateDateColumn({
    type: "timestamp",
    nullable: true,
    default: null,
  })
  verifiedAt: Date;

  @OneToOne((type) => User)
  @JoinColumn()
  verifiedBy: User;
}
