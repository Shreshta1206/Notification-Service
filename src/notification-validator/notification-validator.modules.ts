import { Module, forwardRef } from '@nestjs/common';
import { NotificationValidatorService } from './notification-validator.service';
import { UserPreferencesModule } from 'src/user-preferences/user-prederences.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [UserPreferencesModule, forwardRef(() => NotificationsModule)],
  providers: [NotificationValidatorService],
  exports: [NotificationValidatorService],
})
export class NotificationValidatorModule {}
