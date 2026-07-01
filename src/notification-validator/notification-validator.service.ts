import { Injectable, Logger } from '@nestjs/common';
import { NotificationsRepository } from 'src/notifications/notifications.repository';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { NotificationsDto } from 'src/notifications/dto/notifications.dto';
import {
  NotificationStatus,
  NotificationType,
} from 'src/notifications/notifications.enum';
import { NotificationValidationStatus } from './notification-validator.enum';

@Injectable()
export class NotificationValidatorService {
  private readonly logger = new Logger(NotificationValidatorService.name);
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly userPreferencesService: UserPreferencesService,
  ) {}
  async validateNotification(notificationsDto: NotificationsDto) {
    const userId: number = notificationsDto.user_id;
    const requestId: string = notificationsDto.request_id;
    const type: string = notificationsDto.type;

    // Checking User Preferences
    if (!(await this.checkUserPreference(userId, type))) {
      this.logger.error(
        'Error NotificationsService',
        'User disabled notificaiton.',
      );
      return {
        status: NotificationValidationStatus.FAIL,
        message: 'User disabled notificaiton.',
        requestId: requestId,
      };
    }
    //Checking requestId
    const requestIdCheck = await this.notificationsRepository.findNotification(
      { request_id: requestId },
      {},
    );
    if (requestIdCheck.length > 0) {
      this.logger.error('RequestId already exists.');
      return {
        status: NotificationValidationStatus.FAIL,
        message: 'RequestId already exists',
        requestId: requestId,
      };
    }

    return {
      status: NotificationValidationStatus.SUCCESS,
      message: 'Sucessful Validation',
      requestId: requestId,
    };
  }

  async checkUserPreference(userId: number, type: string): Promise<boolean> {
    const preferences =
      await this.userPreferencesService.getUserPreference(userId);
    console.log('preferences ', preferences);
    if (preferences.emailEnabled == false) return false;
    if (
      type == NotificationType.TRANSACTIONAL &&
      preferences.transactional == false
    )
      return false;

    if (
      type == NotificationType.PROMOTIONAL &&
      preferences.promotional == false
    ) {
      return false;
    } else if (
      type == NotificationType.PROMOTIONAL &&
      preferences.promotional == true
    ) {
      const promotionalLimit = preferences.promotionalLimit;

      const promotionalSent =
        await this.notificationsRepository.countNotification({
          status: NotificationStatus.SENT,
          type: NotificationType.PROMOTIONAL,
        });
      if (promotionalSent == promotionalLimit) return false;
    }

    if (
      type == NotificationType.SYSTEM_ALERT &&
      preferences.systemAlert == false
    )
      return false;

    return true;
  }
}
