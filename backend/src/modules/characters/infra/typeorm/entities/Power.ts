import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('powers')
class Power {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  long_name: string;

  @Column()
  short_name: string;

  @Column()
  level?: number;

  @Column()
  type?: string;

  @Column()
  origin?: string;

  @Column()
  requirements?: string;

  @Column()
  description: string;

  @Column()
  system: string;

  @Column()
  cost?: number;

  @Column()
  source?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Power;
