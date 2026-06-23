import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsRepository } from 'src/notifications/notifications.repository';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async sendEmail(data: Record<string, any>) {
    try {
      const notification = await this.notificationsRepository.findNotification(
        { id: data.notificationId },
        { payload: true, email: true },
      );
      const payload = notification[0]?.payload as {subject: string, body:string};
      const email = notification[0]?.email;
      console.log(payload);
      console.log(email);

      console.log('notificationPayload', payload);
      const message = {
        to: email,
        subject: payload.subject,
        html: payload.body,
      };
      console.log("message ",message);
      const emailSend = await this.mailerService.sendMail({
        ...message,
      });
      return emailSend;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
