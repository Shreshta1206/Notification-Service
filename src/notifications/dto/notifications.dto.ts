import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EmailPayloadDto } from './email-payload.dto';

export class NotificationsDto {
  @IsString()
  request_id: string;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  user_id: number;

  @IsString()
  type: string;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  max_retry_count: number;

  @IsString()
  schedule_at: string;

  @IsEmail()
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  channels: string[];

  @ValidateNested()
  @Type(() => EmailPayloadDto)
  payload: EmailPayloadDto;
}
