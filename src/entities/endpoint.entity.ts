import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class EndpointEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  value!: number;

  @Column()
  expires_at!: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user!: UserEntity;
}