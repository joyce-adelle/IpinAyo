import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Music } from "./Music";
import { UserRole } from "../../utilities/UserRoles";
import { CompositionType } from "../../utilities/CompositionType";
import { ObjectType, Field } from "type-graphql";
@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Field(() => UserRole)
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Field(() => Boolean)
  @Column()
  isComposer: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  isVerified: boolean;

  @Field(() => [CompositionType], { nullable: true })
  @Column({
    type: "set",
    enum: CompositionType,
    nullable: true,
  })
  typeOfCompositions: CompositionType[];

  @Field(() => [Music])
  @OneToMany(() => Music, (music) => music.uploadedBy)
  uploads: Music[];

  @Field(() => [Music])
  @ManyToMany(() => Music, (music) => music.downloadedBy)
  @JoinTable()
  downloads: Music[];

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
}
