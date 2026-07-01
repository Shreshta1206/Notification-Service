import { Injectable, Logger } from '@nestjs/common';
import { UserPreferencesRepository } from './user-preferences.repository';

@Injectable()
export class UserPreferencesService {
  private readonly logger = new Logger(UserPreferencesService.name);
  constructor(
    private readonly userPreferencesRepository: UserPreferencesRepository,
  ) {}

  createUserPreference(data) {
    try {
      this.userPreferencesRepository.createUserPreference(data);
    } catch (error) {
      this.logger.error('Error createUserPreference', error);
    }
  }

  updateUserPreference(userId,data) {
    try {
      this.userPreferencesRepository.updateUserPreference(userId, data);
    } catch (error) {
      this.logger.error('Error updateUserPreference', error);
    }
  }

  async getUserPreference(userId) {
    const userPreferenceRes =
      await this.userPreferencesRepository.findUserPreference(
        { userId: userId },
        {},
      );
    return userPreferenceRes[0];
  }
}
