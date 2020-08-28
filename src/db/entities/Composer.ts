import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne} from "typeorm";
import { User } from "./User";
import { CompositionType } from "../../utilities/CompositionType";

@Entity()
export class Composer{

    @PrimaryGeneratedColumn()
    id: string;
    
    @Column({
        type: "set",
        enum: CompositionType
    })
    typeOfCompositions: CompositionType[]

    @OneToOne(type => User, user => user.composer)
    user: User;
}