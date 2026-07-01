import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('user_preferences')
export class UserPreferencesEntity {
  @PrimaryColumn()
  userId: number;

  @Column()
  emailEnabled: boolean;

  @Column()
  transactional: boolean;

  @Column()
  promotional: boolean;

  @Column()
  promotionalLimit: number;

  @Column()
  systemAlert: boolean;
}
