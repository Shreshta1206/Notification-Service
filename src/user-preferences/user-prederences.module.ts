import { Module } from '@nestjs/common';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferencesEntity } from './user-preferences.entity';
import { UserPreferencesRepository } from './user-preferences.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferencesEntity])],
  providers: [UserPreferencesService, UserPreferencesRepository],
  controllers: [UserPreferencesController],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
