import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany} from "typeorm"
import { Registro } from "./Registro";
@Entity()
export class Equipo extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    inversor: string;

    @Column()
    panel: string;

    @Column()
    equipo: string;

    @Column()
    descripcion: string;

    @Column()
    direccion: number;

    @Column()
    tipo_objeto: string;

    @Column()
    min: number;

    @Column()
    max: number;

    @Column()
    unidad: string;

    @Column({nullable: true})
    f_conv: number;

    @Column()
    enviado: string; 

    @Column()
    iec_870_5_104: number;

    @Column({default: 0})
    desplazamiento: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date;
}