import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Music {

    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(type => User, user => user.uploads)
    uploadedBy: User;
    
}