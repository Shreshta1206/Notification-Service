import { Injectable, Logger } from '@nestjs/common';
import { NotificationsDto } from 'src/notifications/dto/notifications.dto';
import { NotificationStatus } from 'src/notifications/notifications.enum';
import { NotificationsRepository } from 'src/notifications/notifications.repository';
import { NotificationPublisherService } from 'src/notification-publisher/notification-publisher.service';
import { LessThanOrEqual } from 'typeorm/find-options/operator/LessThanOrEqual.js';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationPublisherService: NotificationPublisherService,
  ) {}

  async scheduleNotification(notificationsDto: NotificationsDto) {
    try {
      const notificationRes =
        await this.notificationsRepository.createNotification({
          request_id: notificationsDto.request_id,
          user_id: notificationsDto.user_id,
          email: notificationsDto.email,
          max_retry_count: notificationsDto.max_retry_count,
          retry_count: notificationsDto.max_retry_count,
          channels: notificationsDto.channels,
          payload: notificationsDto.payload,
          type: notificationsDto.type,
          schedule_at: notificationsDto.schedule_at,
          status: NotificationStatus.SCHEDULED,
        });

      return {
        status: NotificationStatus.SCHEDULED,
        message: 'Notification is scheduled.',
        requestId: notificationsDto.request_id,
      };
    } catch (error) {
      this.logger.log('Error scheduleNotification', error);
    }
  }

  async processScheduledNotifications() {
    console.log('new Date()', new Date());
    const scheduledNotifications =
      await this.notificationsRepository.findNotification(
        {
          status: NotificationStatus.SCHEDULED,
          schedule_at: LessThanOrEqual(new Date()),
        },
        {},
      );
    console.log('scheduledNotifications ', scheduledNotifications);
    for (const notification of scheduledNotifications) {
      const message = {
        notificationId: notification.id,
        maxRetryCount: notification.max_retry_count,
        retryCount: 0,
        channel: 'EMAIL',
      };
      const pulishRes =
        this.notificationPublisherService.publishNotification(message);
      if (pulishRes) {
        await this.notificationsRepository.updateNotification(
          { id: notification.id },
          { status: NotificationStatus.QUEUED },
        );
      } else {
        await this.notificationsRepository.updateNotification(
          { id: notification.id },
          { status: NotificationStatus.FAILED },
        );
      }

      this.notificationPublisherService.publishNotification(message);
    }
  }
}
