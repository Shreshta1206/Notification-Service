/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { NotficationsDto } from './notifications.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}
  async sendNotification(notificationsDto: NotficationsDto): Promise<any> {
    const userId: number = notificationsDto.user_id;
    const email: string = notificationsDto.email;

    const notificaitonRes =
      await this.notificationsRepository.createNotification({
        request_id: notificationsDto.request_id,
        user_id: userId,
        email: email,
        channels: notificationsDto.channels,
        payload: notificationsDto.payload,
        status: 'PENDING',
      });

    console.log(notificaitonRes);
    return notificaitonRes;
  }
}
