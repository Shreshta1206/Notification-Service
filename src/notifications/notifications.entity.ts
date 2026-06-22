import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class NotificationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  request_id: number;

  @Column()
  user_id: number;

  @Column()
  email: string;

  @Column('json')
  channels: string[];

  @Column('json')
  payload: Record<string, unknown>;

  @Column('text')
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
