import { Injectable, Logger } from '@nestjs/common';
import { NotificationsDto } from './dto/notifications.dto';
import { NotificationsRepository } from './notifications.repository';
import { NotificationChannel, NotificationStatus } from './notifications.enum';
import { NotificationValidatorService } from 'src/notification-validator/notification-validator.service';
import { NotificationValidationStatus } from 'src/notification-validator/notification-validator.enum';
import { NotificationSchedulerService } from 'src/notification-scheduler/notification-scheduler.service';
import { NotificationPublisherService } from 'src/notification-publisher/notification-publisher.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationValidatorService: NotificationValidatorService,
    private readonly notificationSchedulerService: NotificationSchedulerService,
    private readonly notificationPublisherService: NotificationPublisherService,
  ) {}
  async sendNotification(notificationsDto: NotificationsDto) {
    try {
      const userId: number = notificationsDto.user_id;
      const email: string = notificationsDto.email;
      const validationResult =
        await this.notificationValidatorService.validateNotification(
          notificationsDto,
        );
      if (validationResult.status == NotificationValidationStatus.FAIL) {
        return validationResult;
      }

      const currentTime: Date = new Date();

      const scheduledTime = new Date(notificationsDto.schedule_at);
      let result;
      if (scheduledTime > currentTime) {
        result =
          await this.notificationSchedulerService.scheduleNotification(
            notificationsDto,
          );
      } else {
        const notificationRes =
          await this.notificationsRepository.createNotification({
            request_id: notificationsDto.request_id,
            user_id: userId,
            email: email,
            max_retry_count: notificationsDto.max_retry_count,
            retry_count: notificationsDto.max_retry_count,
            channels: notificationsDto.channels,
            payload: notificationsDto.payload,
            type: notificationsDto.type,
            schedule_at: notificationsDto.schedule_at,
            status: NotificationStatus.PENDING,
          });
        const message = {
          notificationId: notificationRes.id,
          maxRetryCount: notificationRes.max_retry_count,
          retryCount: 0,
          channel: NotificationChannel.EMAIL,
        };
        result = this.notificationPublisherService.publishNotification(message);
        if (result.status === NotificationStatus.QUEUED) {
          await this.notificationsRepository.updateNotification(
            notificationRes.id,
            {
              status: NotificationStatus.QUEUED,
            },
          );
        } else {
          await this.notificationsRepository.updateNotification(
            notificationRes.id,
            {
              status: NotificationStatus.FAILED,
            },
          );
          throw new Error('Failed to Queue');
        }
      }
      return result;
    } catch (error) {
      this.logger.error('Error NotificationsService', error);
      return {
        status: NotificationStatus.FAILED,
        message: 'Error occured',
      };
    }
  }
}
