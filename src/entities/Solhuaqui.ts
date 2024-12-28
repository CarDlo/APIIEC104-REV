import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  
  @Entity()
  export class Solhuaqui extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()//MOD.REG(Modbus) o Common Addres(IEC104)
    REG_CA: number;
  
    @Column({ type: "float" })
    value: number;
  
    @Column({type: 'int', nullable: true})//IEC104  Information Object Address (IOA) //Adicional para Modbus
    direccion: number | null;
  
    @Column({ type: "json", nullable: true }) // Almcenamiento de datos adicionales
    metadata: Record<string, any> | null;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }