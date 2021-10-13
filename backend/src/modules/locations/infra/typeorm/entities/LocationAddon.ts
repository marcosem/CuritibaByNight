import Location from '@modules/locations/infra/typeorm/entities/Location';
import Addon from '@modules/locations/infra/typeorm/entities/Addon';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('locations_addons')
class LocationAddon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location_id: string;

  @Column()
  addon_name: string;

  @Column()
  addon_level: number;

  @Column()
  addon_id_current: string | null;

  @Column()
  addon_id_next: string | null;

  @Column()
  temp_ability: number;

  @Column()
  temp_influence: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  locationId?: Location;

  @ManyToOne(() => Addon)
  @JoinColumn({ name: 'addon_id_current' })
  currentAddon?: Addon;

  @ManyToOne(() => Addon)
  @JoinColumn({ name: 'addon_id_next' })
  nextAddon?: Addon;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default LocationAddon;
