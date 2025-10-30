export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  icon?: string;
  actionUrl?: string;
  metadata?: {
    userId?: number;
    entityId?: number;
    entityType?: string;
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface GetNotificationsInput {
  page: number;
  limit: number;
  unreadOnly?: boolean;
}
