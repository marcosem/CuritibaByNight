import Character from '@modules/characters/infra/typeorm/entities/Character';
import User from '@modules/users/infra/typeorm/entities/User';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('influence_actions')
class InfluenceAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  action_period: string;

  @Column()
  backgrounds?: string;

  @Column()
  influence: string;

  @Column()
  influence_level: number;

  @Column()
  influence_effetive_level: number;

  @Column()
  ability?: string;

  @Column()
  ability_level?: number;

  @Column()
  endeavor?: string;

  @Column()
  character_id: string;

  @ManyToOne(() => Character, { cascade: true })
  @JoinColumn({ name: 'character_id' })
  characterId?: Character;

  @Column()
  action_owner_id: string | null;

  @ManyToOne(() => Character, { cascade: true })
  @JoinColumn({ name: 'action_owner_id' })
  ownerId?: Character;

  @Column()
  storyteller_id: string | null;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'storyteller_id' })
  storytellerId?: User;

  @Column()
  action?: string;

  @Column()
  action_force?: number;

  @Column()
  status?: string;

  @Column()
  st_reply?: string;

  @Column()
  news?: string;

  @Column()
  result?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default InfluenceAction;
