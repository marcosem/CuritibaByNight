import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import { Expose } from 'class-transformer';

@Entity('characters')
class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  email: string;

  @Column()
  experience: number;

  @Column()
  file: string;

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
}

export default Character;
