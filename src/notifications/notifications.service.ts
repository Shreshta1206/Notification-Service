/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { NotficationsDto } from './notifications.dto';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsEntity } from './notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}
  async sendNotification(
    notificationsDto: NotficationsDto,
  ): Promise<NotificationsEntity> {
    const userId: number = notificationsDto.user_id;
    const email: string = notificationsDto.email;

    const notificaitonRes =
      await this.notificationsRepository.createNotification({
        request_id: notificationsDto.request_id,
        user_id: userId,
        email: email,
        max_retry_count: notificationsDto.max_retry_count,
        retry_count: notificationsDto.max_retry_count,
        channels: notificationsDto.channels,
        payload: notificationsDto.payload,
        status: 'PENDING',
      });

    // console.log(notificaitonRes);
    return notificaitonRes;
  }
}
