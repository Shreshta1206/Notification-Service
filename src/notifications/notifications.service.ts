import { Injectable, Logger } from '@nestjs/common';
import { NotificationsDto } from './dto/notifications.dto';
import { NotificationsRepository } from './notifications.repository';
import { RabbitMQService } from 'src/queue/rabbitmq.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly rabbitmqService: RabbitMQService,
  ) {}
  async sendNotification(notificationsDto: NotificationsDto) {
    try {
      const userId: number = notificationsDto.user_id;
      const email: string = notificationsDto.email;
      const requestId: number = notificationsDto.request_id;

      const requestIdCheck =
        await this.notificationsRepository.findNotification(
          { request_id: requestId },
          { request_id: true },
        );
      if (requestIdCheck.length > 0) {
        this.logger.error('RequestId already exists.');
        return {
          status: 'FAILED',
          message: 'RequestId already exists',
          requestId: requestId,
        };
      }
      const notificationRes =
        await this.notificationsRepository.createNotification({
          request_id: notificationsDto.request_id,
          user_id: userId,
          email: email,
          max_retry_count: notificationsDto.max_retry_count,
          retry_count: notificationsDto.max_retry_count,
          channels: notificationsDto.channels,
          payload: notificationsDto.payload,
          status: 'PENDING',
        });

      const publishRes = this.rabbitmqService.publish({
        notificationId: notificationRes.id,
        maxRetryCount: notificationRes.max_retry_count,
        retryCount: 0,
        channel: 'EMAIL',
      });

      if (!publishRes) {
        this.logger.error('Faillure in publishing notification');
        return {
          status: 'FAILURE',
          message: 'Try after sometime.',
          requestId: requestId,
        };
      }
      this.logger.log('Published message successfully');
      return {
        status: 'PROCESSING',
        message: 'Notification queued',
        requestId: requestId,
      };
    } catch (error) {
      this.logger.error('Error occured', error);
    }
  }
}
