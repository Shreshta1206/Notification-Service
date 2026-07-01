import { Module, forwardRef } from '@nestjs/common';

import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationPublisherModule } from 'src/notification-publisher/notification-publisher.module';

@Module({
  imports: [forwardRef(() => NotificationsModule), NotificationPublisherModule],
  providers: [NotificationSchedulerService],
  exports: [NotificationSchedulerService],
})
export class NotificationSchedulerModule {}
