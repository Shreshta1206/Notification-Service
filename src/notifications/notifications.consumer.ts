/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class NotificaitonConsumer implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(NotificaitonConsumer.name);

  constructor(private readonly emailService: EmailService) {
    const connection = amqp.connect(['amqp://localhost']);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('email_notification_queue', {
          durable: true,
          deadLetterExchange: 'email_notification_dlx',
          deadLetterRoutingKey: 'email_notification_failed',
        });
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        await channel.consume('email_notification_queue', async (message) => {
          if (message) {
            await this.handleMessage(message, channel);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  private async handleMessage(message, channel) {
    try {
      const content = JSON.parse(message.content.toString());
      await this.emailService.sendEmail(content);
      channel.ack(message);
    } catch (error) {
      this.logger.error('Error in emailing', error);
      const content = JSON.parse(message.content.toString());
      if (content.retryCount < content.maxRetryCount) {
        content.retryCount += 1;
        channel.ack(message);

        await channel.sendToQueue(
          'email_notification_queue',
          Buffer.from(JSON.stringify(content)),
          {
            persistent: true,
          },
        );
      } else {
        this.logger.error('can\t email');
        channel.nack(message, false, false);
      }
    }
  }
}
