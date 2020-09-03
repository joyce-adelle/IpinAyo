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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column()
  isComposer: boolean;

  @Column({
    type: "set",
    enum: CompositionType,
    nullable: true,
  })
  typeOfCompositions: CompositionType[];

  @OneToMany((type) => Music, (upload) => upload.uploadedBy)
  uploads: Music[];

  @RelationId((uploadedMusic: User) => uploadedMusic.uploads)
  uploadedMusicIds: string[];

  @ManyToMany((type) => Music)
  @JoinTable()
  downloads: Music[];

  @RelationId((downloadedMusic: User) => downloadedMusic.downloads)
  downloadedMusicIds: string[];

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
}
