/* eslint-disable camelcase */
// import { uuid } from 'uuidv4';
// import { startOfDay } from 'date-fns';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}

export default User;
