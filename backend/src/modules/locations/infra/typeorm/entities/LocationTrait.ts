import Location from '@modules/locations/infra/typeorm/entities/Location';
import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('locations_traits')
class LocationTrait {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location_id: string;

  @Column()
  trait_id: string;

  @Column()
  level: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  locationId?: Location;

  @ManyToOne(() => LocationAvailableTrait)
  @JoinColumn({ name: 'trait_id' })
  traitId?: LocationAvailableTrait;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default LocationTrait;
