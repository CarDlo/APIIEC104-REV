import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
