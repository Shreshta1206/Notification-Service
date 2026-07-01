import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsEntity } from './notifications.entity';
import { NotificationsRepository } from './notifications.repository';
import { NotificaitonConsumer } from './notifications.consumer';
import { UserPreferencesModule } from 'src/user-preferences/user-prederences.module';
import { NotificationValidatorModule } from 'src/notification-validator/notification-validator.modules';
import { NotificationSchedulerModule } from 'src/notification-scheduler/notification-scheduler.module';
import { NotificationPublisherModule } from 'src/notification-publisher/notification-publisher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationsEntity]),
    UserPreferencesModule,
    NotificationValidatorModule,
    NotificationSchedulerModule,
    NotificationPublisherModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    NotificaitonConsumer,
  ],
  exports: [NotificationsRepository, NotificationsService],
})
export class NotificationsModule {}
