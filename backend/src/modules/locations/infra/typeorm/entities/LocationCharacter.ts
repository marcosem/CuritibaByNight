import Location from '@modules/locations/infra/typeorm/entities/Location';
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

@Entity('locations_characters')
class LocationCharacter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location_id: string;

  @Column()
  character_id: string;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  locationId?: Location;

  @ManyToOne(() => Character)
  @JoinColumn({ name: 'character_id' })
  characterId?: Character;

  @Column()
  shared: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default LocationCharacter;
