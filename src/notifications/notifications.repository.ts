import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsEntity } from './notifications.entity';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly notificationsRepository: Repository<NotificationsEntity>,
  ) {}

  async createNotification(data: any) {
    const notification = this.notificationsRepository.create(data);
    await this.notificationsRepository.save(notification);
  }
}
