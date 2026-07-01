import amqp, { Channel, ChannelModel } from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationChannel } from 'src/notifications/notifications.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: ChannelModel;
  private channel: Channel;
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');

    this.channel = await this.connection.createChannel();

    const emailDlX = this.configService.getOrThrow<string>('EMAIL_DLX');
    const emailDlQ = this.configService.getOrThrow<string>('EMAIL_DLQ');
    const emailDlR = this.configService.getOrThrow<string>('EMAIL_DLR');
    const emailQueue = this.configService.getOrThrow<string>('EMAIL_QUEUE');
    await this.channel.assertExchange(emailDlX, 'direct', {
      durable: true,
    });
    await this.channel.assertQueue(emailDlQ, {
      durable: true,
    });
    await this.channel.bindQueue(emailDlQ, emailDlX, emailDlR);
    await this.channel.assertQueue(emailQueue, {
      durable: true,
      deadLetterExchange: emailDlX,
      deadLetterRoutingKey: emailDlR,
    });
  }

  publish(message: Record<string, any>): boolean {
    const emailQueue = this.configService.getOrThrow<string>('EMAIL_QUEUE');
    return this.channel.sendToQueue(
      emailQueue,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );
  }
}
