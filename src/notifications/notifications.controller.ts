import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotficationsDto } from './notifications.dto';
import { RabbitMQService } from 'src/rabbitmq.service';

@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  @Post('notification')
  async createNotification(
    @Body() notificationsDto: NotficationsDto,
  ): Promise<void> {
    const notification =
      await this.notificationsService.sendNotification(notificationsDto);

    // console.log("notification res ",notification);
    this.rabbitmqService.publish({
      notificationId: notification.id,
      channel: 'EMAIL',
    });
  }
}
