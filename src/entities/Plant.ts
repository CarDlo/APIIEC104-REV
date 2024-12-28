import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("plant")
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  province: string;

  @Column({ type: "varchar", length: 255 })
  country: string;

  @Column({ type: "float", name: "potencia_dc" })
  potenciaDC: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  scada: string;

  @Column({
    type: "enum",
    enum: ["IEC104", "MODBUS"],
    name: "protocolo_comunicacion",
  })
  protocoloComunicacion: "IEC104" | "MODBUS";

  @Column({ type: "varchar", length: 255 })
  ip: string;

  @Column({ type: "int" })
  puerto: number;

  @Column({ type: "varchar", length: 255, name: "api_url" })
  apiUrl: string;

  @Column({ type: "json", nullable: true })
  credenciales: object;

  @Column({ type: "jsonb", nullable: true })
  metadata: object;

  @Column({ type: 'boolean', default: false })
  active: boolean;
}
