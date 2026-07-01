import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsRepository } from 'src/notifications/notifications.repository';
import { NotificationStatus } from 'src/notifications/notifications.enum';

// import { EmailPayload } from './email-payload.interface';

@Injectable()
export class EmailService {
  private count = 0;
  constructor(
    private mailerService: MailerService,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async sendEmail(data: Record<string, any>) {
    try {
      const notification = await this.notificationsRepository.findNotification(
        { id: data.notificationId, status: NotificationStatus.QUEUED },
        { payload: true, email: true, status: true },
      );

      await this.notificationsRepository.updateNotification(
        data.notificationId,
        {
          retry_count: data.retryCount,
          status: NotificationStatus.PROCESSING,
        },
      );

      const payload = notification[0]?.payload;
      const email = notification[0]?.email;
      // console.log(payload);
      // console.log(email);

      console.log('notificationPayload', payload);
      const message = {
        to: email,
        subject: payload?.subject,
        text: payload?.text,
        html: payload?.html,
        attachments: payload?.attachments,
      };
      // console.log('this.count ', this.count);
      console.log("message ",message);
      // if (this.count < 1) {
      //   this.count += 1;
      //   throw new NotFoundException('User with this ID does not exist.');
      // }
      await this.mailerService.sendMail(message);
      await this.notificationsRepository.updateNotification(
        data.notificationId,
        {
          status: NotificationStatus.SENT,
        },
      );
    } catch (error) {
      console.log(error);
      await this.notificationsRepository.updateNotification(
        data.notificationId,
        {
          status: NotificationStatus.FAILED,
        },
      );
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
