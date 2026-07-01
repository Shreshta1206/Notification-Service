import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationSchedulerService } from 'src/notification-scheduler/notification-scheduler.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly notificationSchedulerService: NotificationSchedulerService,
  ) {
    console.log('SchedulerService initialized');
  }

  @Cron('* * * * *')
  async sendScheduledNotifications() {
    this.logger.log('sendScheduledNotifications picked up job');
    await this.notificationSchedulerService.processScheduledNotifications();
  }
}
