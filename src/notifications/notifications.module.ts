import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsEntity } from './notifications.entity';
import { NotificationsRepository } from './notifications.repository';
import { RabbitMQService } from 'src/queue/rabbitmq.service';
import { NotificaitonConsumer } from './notifications.consumer';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsEntity])],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    RabbitMQService,
    NotificaitonConsumer,
    EmailService,
  ],
  exports: [NotificationsRepository],
})
export class NotificationsModule {}
