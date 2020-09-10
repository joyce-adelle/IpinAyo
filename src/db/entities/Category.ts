import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  Tree,
  Column,
  TreeChildren,
  TreeParent,
  RelationId,
} from "typeorm";
import { Music } from "./Music";
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity()
@Tree("closure-table")
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => [Category], { nullable: true })
  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @Field(() => String, { nullable: true })
  @RelationId((cat: Category) => cat.parent)
  parentId: string;

  @ManyToMany((type) => Music, (music) => music.categories)
  relatedMusic: Music[];

  @Field(() => [String])
  @RelationId((relatedMusic: Category) => relatedMusic.relatedMusic)
  relatedMusicIds: string[];
}
