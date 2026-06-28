import { IsNotEmpty, IsString } from 'class-validator';

export class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;
}
