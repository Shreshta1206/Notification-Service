import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsEntity } from './notifications.entity';

@Injectable()
export class NotificationsRepository {
  private readonly logger = new Logger(NotificationsRepository.name);
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly notificationsRepository: Repository<NotificationsEntity>,
  ) {}

  async createNotification(data: Record<string, any>) {
    try {
      const notification = this.notificationsRepository.create(data);
      return await this.notificationsRepository.save(notification);
    } catch (error) {
      this.logger.error('Error createNotification', error);
      throw error;
    }
  }

  async findNotification(
    whereCondition: Record<string, any>,
    selectCondition: Record<string, any>,
  ) {
    try {
      const result = await this.notificationsRepository.find({
        where: whereCondition,
        select: selectCondition,
      });

      return result;
    } catch (error) {
      this.logger.error('Error findNotification', error);
      throw error;
    }
  }

  async updateNotification(id, newValues) {
    try {
      return await this.notificationsRepository.update(id, newValues);
    } catch (error) {
      this.logger.error('Error updateNotification', error);
      throw error;
    }
  }
}
