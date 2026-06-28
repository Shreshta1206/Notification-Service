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
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  request_id: number;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  user_id: number;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  max_retry_count: number;

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
