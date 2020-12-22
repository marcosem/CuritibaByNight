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

import { Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

@Entity('locations')
class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  elysium: boolean;

  @Column()
  type: string;

  @Column()
  level: number;

  @Column()
  property: string;

  @Column()
  clan: string;

  @Column()
  responsible: string;

  @ManyToOne(() => Character)
  @JoinColumn({ name: 'responsible' })
  responsible_char?: Character;

  @Column()
  picture: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'picture_url' })
  getAvatarUrl(): string | null {
    if (!this.picture) {
      return null;
    }

    const avatarUpload = uploadConfig('locations');

    switch (avatarUpload.driver) {
      case 's3':
        return `https://${avatarUpload.config.s3.bucket}.s3.us-east-2.amazonaws.com/${this.picture}`;
      case 'disk':
        return `${process.env.APP_API_URL}/pictures/${this.picture}`;
      default:
        return null;
    }
  }
}

export default Location;
