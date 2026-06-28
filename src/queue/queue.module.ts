import { Module } from '@nestjs/common';
import { RabbitMQService } from 'src/queue/rabbitmq.service';

@Module({
  exports: [RabbitMQService],
})
export class NotificationsModule {}
