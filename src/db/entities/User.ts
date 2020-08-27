import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne, JoinColumn} from "typeorm";
import { Music } from "./Music";
import { UserRole } from "../../utilities/UserRoles";
import { Composer } from "./Composer";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({select: false})
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @Column()
    isComposer: boolean

    @OneToOne(type => Composer, composer => composer.user,  {
        cascade: true,
        nullable: true
    }) 
    @JoinColumn()
    composer: Composer;

    @OneToMany(type => Music, upload => upload.uploadedBy)
    uploads: Music[];

    @ManyToMany(type => Music)
    @JoinTable()
    downloads: Music[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

}
