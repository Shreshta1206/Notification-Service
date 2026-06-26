export class NotficationsDto {
  request_id: number;
  user_id: number;
  max_retry_count: number;
  email: string;
  channels: string[];
  payload: any;
}
