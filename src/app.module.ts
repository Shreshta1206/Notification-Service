import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsEntity } from './notifications/notifications.entity';
import { EmailModule } from './email/email.module';
import { UserPreferencesEntity } from './user-preferences/user-preferences.entity';
import { UserPreferencesModule } from './user-preferences/user-prederences.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { NotificationSchedulerModule } from './notification-scheduler/notification-scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [NotificationsEntity, UserPreferencesEntity],
        synchronize: true,
        logging: true,
      }),
    }),
    NotificationsModule,
    EmailModule,
    UserPreferencesModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
    NotificationSchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
