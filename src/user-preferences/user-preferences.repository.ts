import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferencesEntity } from './user-preferences.entity';

@Injectable()
export class UserPreferencesRepository {
  private readonly logger = new Logger(UserPreferencesRepository.name);
  constructor(
    @InjectRepository(UserPreferencesEntity)
    private readonly userPreferencesRepository: Repository<UserPreferencesEntity>,
  ) {}

  async createUserPreference(data: Record<string, any>) {
    try {
      const notification = this.userPreferencesRepository.create(data);
      return await this.userPreferencesRepository.save(notification);
    } catch (error) {
      this.logger.error('Error createUserPreference', error);
      throw error;
    }
  }

  async findUserPreference(
    whereCondition: Record<string, any>,
    selectCondition: Record<string, any>,
  ) {
    try {
      const result = await this.userPreferencesRepository.find({
        where: whereCondition,
        select: selectCondition,
      });

      return result;
    } catch (error) {
      this.logger.error('Error findUserPreference', error);
      throw error;
    }
  }

  async updateUserPreference(id, newValues) {
    try {
      return await this.userPreferencesRepository.update(id, newValues);
    } catch (error) {
      this.logger.error('Error updateUserPreference', error);
      throw error;
    }
  }
}
