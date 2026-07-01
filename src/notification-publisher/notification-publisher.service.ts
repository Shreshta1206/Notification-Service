import { Injectable, Logger } from '@nestjs/common';
import { NotificationStatus } from 'src/notifications/notifications.enum';
import { RabbitMQService } from 'src/queue/rabbitmq.service';

@Injectable()
export class NotificationPublisherService {
  private readonly logger = new Logger(NotificationPublisherService.name);
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  publishNotification(message: Record<string, any>) {
    const pulishResponse = this.rabbitMQService.publish(message);
    if (pulishResponse) {
      this.logger.log('Published message successfully');
      return {
        status: NotificationStatus.QUEUED,
        message: 'Notification queued',
      };
    } else {
      this.logger.error('Faillure in publishing notification');
      return {
        status: NotificationStatus.FAILED,
        message: 'Try after sometime.',
      };
    }
  }
}
