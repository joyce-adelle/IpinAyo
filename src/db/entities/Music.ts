import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { User } from "./User";
import { ScoreType } from "../../utilities/ScoreType";
import { RelatedWords } from "../../utilities/RelatedWords";
import { Category } from "./Category";

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

  @Column({type: "text"})
  description: string;

  @Column({
    nullable: true,
  })
  composerName: string;

  @Column({type: "year", nullable: true})
  yearOfComposition: string;

  @Column({
    nullable: true,
  })
  arrangerName: string;

  @Column({type: "year", nullable: true})
  yearOfArrangement: string;

  @Column("simple-array")
  languages: string[];

  @Column({
    type: "enum",
    enum: ScoreType
})
  scoreType: ScoreType;

  @Column()
  isVerified: boolean;

  @ManyToOne((type) => User, (user) => user.uploads)
  uploadedBy: User;

  @Column({
    type: "set",
    enum: RelatedWords
})
  relatedWords: RelatedWords[];

  @ManyToMany((type) => Category, (category) => category.relatedMusic)
  @JoinTable()
  categories: Category[];

}
