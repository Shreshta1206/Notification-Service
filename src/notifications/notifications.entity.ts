import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { NotificationStatus, NotificationType } from './notifications.enum';

@Entity('notifications')
export class NotificationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  request_id: string;

  @Column()
  user_id: number;

  @Column()
  email: string;

  @Column()
  type: NotificationType;

  @Column()
  max_retry_count: number;

  @Column()
  schedule_at: Date;

  @Column()
  retry_count: number;

  @Column('json')
  channels: string[];

  @Column('json')
  payload: any;

  @Column('text')
  status: NotificationStatus;

  @CreateDateColumn()
  created_at: Date;
}
