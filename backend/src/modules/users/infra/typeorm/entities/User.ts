import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  storyteller: boolean;

  @Column()
  avatar: string;

  @Column()
  secret: string;

  @Column('timestamp with time zone')
  lastLogin_at: Date;

  // @Column('timestamp with time zone')
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

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

export default User;
