import amqp, { Channel, ChannelModel } from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: ChannelModel;
  private channel: Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');

    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue('notification_queue', {
      durable: true,
    });
  }

  publish(message: Record<string, any>) {
    this.channel.sendToQueue(
      'notification_queue',
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );
  }
}
