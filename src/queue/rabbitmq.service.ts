import amqp, { Channel, ChannelModel } from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: ChannelModel;
  private channel: Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');

    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange('email_notification_dlx', 'direct', {
      durable: true,
    });
    await this.channel.assertQueue('email_notification_dlq', {
      durable: true,
    });
    await this.channel.bindQueue(
      'email_notification_dlq',
      'email_notification_dlx',
      'email_notification_failed',
    );
    await this.channel.assertQueue('email_notification_queue', {
      durable: true,
      deadLetterExchange: 'email_notification_dlx',
      deadLetterRoutingKey: 'email_notification_failed',
    });
  }

  publish(message: Record<string, any>): boolean {
    return this.channel.sendToQueue(
      'email_notification_queue',
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );
  }
}
