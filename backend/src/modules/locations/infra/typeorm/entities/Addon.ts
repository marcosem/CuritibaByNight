import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('addons')
class Addon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  level: number;

  @Column()
  description: string;

  @Column()
  defense: number;

  @Column()
  surveillance: number;

  @Column({ type: 'varchar', nullable: true })
  req_background: string | null;

  @Column({ type: 'varchar', nullable: true })
  req_merit: string | null;

  @Column({ type: 'varchar', nullable: true })
  req_influence: string | null;

  @Column({ type: 'varchar', nullable: true })
  req_other: string | null;

  @Column({ type: 'varchar', nullable: true })
  req_addon_1: string | null;

  @Column({ type: 'varchar', nullable: true })
  req_addon_2: string | null;

  @Column({ type: 'varchar', nullable: true })
  req_addon_3: string | null;

  @Column()
  ability: string;

  @Column()
  ability_qty: number;

  @Column()
  influence: string;

  @Column()
  influence_qty: number;

  @Column()
  time_qty: number;

  @Column()
  time_type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Addon;
