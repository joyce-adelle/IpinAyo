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
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
@Tree("closure-table")
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => [Category])
  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @Field(() => String, { nullable: true })
  @RelationId((cat: Category) => cat.parent)
  parentId: string;

  @ManyToMany(() => Music, (music) => music.categories)
  relatedMusic: Music[];
}
