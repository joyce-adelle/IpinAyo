import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  RelationId,
} from "typeorm";
import { Music } from "./Music";
import { UserRole } from "../../utilities/UserRoles";
import { CompositionType } from "../../utilities/CompositionType";
import { ObjectType, Field, ID } from "type-graphql";
@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column()
  firstName: string

  @Field(() => String)
  @Column()
  lastName: string

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

  @Field(() => [CompositionType], { nullable: true })
  @Column({
    type: "set",
    enum: CompositionType,
    nullable: true,
  })
  typeOfCompositions: CompositionType[];

  @OneToMany((type) => Music, (upload) => upload.uploadedBy)
  uploads: Music[];

  @Field(() => [String])
  @RelationId((uploadedMusic: User) => uploadedMusic.uploads)
  uploadedMusicIds: string[];

  @ManyToMany((type) => Music)
  @JoinTable()
  downloads: Music[];

  @Field(() => [String])
  @RelationId((downloadedMusic: User) => downloadedMusic.downloads)
  downloadedMusicIds: string[];

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
