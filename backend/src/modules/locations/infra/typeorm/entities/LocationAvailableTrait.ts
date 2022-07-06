import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('location_available_traits')
class LocationCharacter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trait: string;

  @Column()
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default LocationCharacter;
