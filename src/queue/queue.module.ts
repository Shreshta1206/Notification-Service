import { Module } from '@nestjs/common';
import { RabbitMQService } from 'src/queue/rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class QeueuModule {}
