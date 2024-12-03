import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity} from "typeorm"

@Entity()
export class Equipo extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    panel: string;

    @Column()
    equipo: string;

    @Column()
    descripcion: string;

    @Column()
    IOA: number;

    @Column()
    tipo: string;

    @Column()
    min: number;

    @Column()
    max: number;

    @Column()
    factor: number;

    @Column()
    codIEC104: number;

    @Column()
    desplazamiento: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date;
}