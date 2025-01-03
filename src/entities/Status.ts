import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity()
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  processNumber: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  plantName: string;

  @Column({
    type: "enum",
    enum: ["online", "offline", "error"],
    name: "status",
  })
  status: "online" | "offline" | "error";

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "json", nullable: true })
  errors: Record<string, any> | null;
}
