export enum NotificationStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  SCHEDULED = 'SCHEDULED',
}

export enum NotificationType {
  TRANSACTIONAL = 'transactional',
  PROMOTIONAL = 'promotional',
  SYSTEM_ALERT = 'system_alert',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
}
