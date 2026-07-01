import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NotificationSchedulerModule } from 'src/notification-scheduler/notification-scheduler.module';

@Module({
  providers: [SchedulerService],
  imports: [NotificationSchedulerModule],
})
export class SchedulerModule {}
