import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  Tree,
  Column,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Music } from "./Music";

@Entity()
@Tree("closure-table")
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @ManyToMany((type) => Music, (music) => music.categories)
  relatedMusic: Music[];
}
