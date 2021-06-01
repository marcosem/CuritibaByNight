import Character from '@modules/characters/infra/typeorm/entities/Character';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('characters_traits')
class CharacterTrait {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  character_id?: string;

  @Column()
  trait: string;

  @Column()
  level: number;

  @Column()
  level_temp?: string;

  @Column()
  type: string;

  @ManyToOne(() => Character)
  @JoinColumn({ name: 'character_id' })
  characterId?: Character;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CharacterTrait;
