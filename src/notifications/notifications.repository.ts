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

  async createNotification(data: Record<string, any>) {
    const notification = this.notificationsRepository.create(data);
    return await this.notificationsRepository.save(notification);
  }

  async findNotification(
    whereCondition: Record<string, any>,
    selectCondition: Record<string, any>,
  ) {
    const result = await this.notificationsRepository.find({
      where: whereCondition,
      select: selectCondition,
    });

    return result;
  }

  async updateNotification(id, newValues) {
    return await this.notificationsRepository.update(id, newValues);
  }
}
