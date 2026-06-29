import { Body, Controller, Patch, Post, Param } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';

@Controller('user_preference')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Post()
  createUserPreference(@Body() data) {
    return this.userPreferencesService.createUserPreference(data);
  }

  @Patch(':userId')
  updateUserPreference(@Param('userId') userId: number, @Body() data) {
    return this.userPreferencesService.updateUserPreference(
      Number(userId),
      data,
    );
  }
}
