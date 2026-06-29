import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsDto } from './dto/notifications.dto';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async createNotification(@Body() notificationsDto: NotificationsDto) {
    return await this.notificationsService.sendNotification(notificationsDto);
  }
}
