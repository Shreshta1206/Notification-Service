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

  @Column()
  max_retry_count: number;

  @Column()
  retry_count: number;

  @Column('json')
  channels: string[];

  @Column('json')
  payload: any;

  @Column('text')
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
