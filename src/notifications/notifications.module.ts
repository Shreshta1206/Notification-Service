import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsEntity } from './notifications.entity';
import { NotificationsRepository } from './notifications.repository';
import { RabbitMQService } from 'src/queue/rabbitmq.service';
import { NotificaitonConsumer } from './notifications.consumer';
import { UserPreferencesModule } from 'src/user-preferences/user-prederences.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationsEntity]),
    UserPreferencesModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    RabbitMQService,
    NotificaitonConsumer,
  ],
  exports: [NotificationsRepository],
})
export class NotificationsModule {}
