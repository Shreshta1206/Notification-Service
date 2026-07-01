import { Module } from '@nestjs/common';
import { NotificationPublisherService } from './notification-publisher.service';
import { QeueuModule } from 'src/queue/queue.module';

@Module({
  imports: [QeueuModule],
  providers: [NotificationPublisherService],
  exports: [NotificationPublisherService],
})
export class NotificationPublisherModule {}
