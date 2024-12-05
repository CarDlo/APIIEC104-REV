import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn} from "typeorm"
import { Equipo } from "./Equipo";

@Entity()
export class Registro extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // La columna equipo_iec_870_5_104 es una foreign key que hace referencia a la columna iec_870_5_104 de la tabla Equipo.
    // Esta columna se utiliza para relacionar un registro con su equipo asociado.
    // La relacion es ManyToOne, lo que significa que varios registros pueden tener el mismo equipo asociado.
    @ManyToOne(() => Equipo, (equipo) => equipo.registros)
    @JoinColumn({ name: "equipo_iec_870_5_104", referencedColumnName: "iec_870_5_104" })
    equipo: Equipo;

    @Column({type: "float"})   
    value: number;

    @Column()
    direccion: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date;

}
