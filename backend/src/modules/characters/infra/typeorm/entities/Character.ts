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

import { Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

@Entity('characters')
class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  user_id: string | null;

  // @ManyToOne(() => User, { eager: true })
  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column()
  experience: number;

  @Column()
  experience_total: number;

  @Column()
  file: string;

  @Column()
  avatar: string;

  @Column()
  clan: string;

  @Column()
  title: string;

  @Column()
  coterie: string;

  @Column()
  situation: string;

  @Column()
  npc: boolean;

  @Column()
  regnant: string;

  @ManyToOne(() => Character )
  @JoinColumn({ name: 'regnant' })
  regnant_char?: Character;

  @Column()
  retainer_level: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'character_url' })
  getCharacterUrl(): string | null {
    if (!this.file) {
      return null;
    }

    const sheetUpload = uploadConfig('sheet');

    switch (sheetUpload.driver) {
      case 's3':
        return `https://${sheetUpload.config.s3.bucket}.s3.us-east-2.amazonaws.com/${this.file}`;
      case 'disk':
        return `${process.env.APP_API_URL}/character/sheet/${this.file}`;
      default:
        return null;
    }
  }

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    const avatarUpload = uploadConfig('avatar');

    switch (avatarUpload.driver) {
      case 's3':
        return `https://${avatarUpload.config.s3.bucket}.s3.us-east-2.amazonaws.com/${this.avatar}`;
      case 'disk':
        return `${process.env.APP_API_URL}/avatar/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default Character;
