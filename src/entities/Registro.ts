import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn} from "typeorm"
import { Equipo } from "./Equipo";

@Entity()
export class Registro extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    equipo_iec_870_5_104: number;

    @Column({type: "float"})   
    value: number;

    @Column()
    direccion: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date;

}
