export type ActivityType =
  | "file_upload"
  | "chat_created"
  | "message_sent"
  | "friend_request_sent"
  | "friend_request_accepted"
  | "friend_request_rejected";

export interface FileUploadMetadata {
  fileId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  location?: string; // Optional location in "City, State" format for images
}

export interface ChatCreatedMetadata {
  chatId: string;
}

export interface MessageSentMetadata {
  chatId: string;
  messageId: string;
  messageText: string;
}

export interface FriendRequestMetadata {
  friendRequestId: string;
  friendId: string;
  friendUsername: string;
}

export type ActivityMetadata =
  | FileUploadMetadata
  | ChatCreatedMetadata
  | MessageSentMetadata
  | FriendRequestMetadata;

export interface Activity {
  id: string;
  activityType: ActivityType;
  metadata: ActivityMetadata;
  createdAt: string;
}

export interface TimelineDay {
  date: string;
  activities: Activity[];
  count: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TimelineData {
  timeline: TimelineDay[];
  pagination: PaginationInfo;
}

export interface TimelineResponse extends TimelineData {
  success: boolean;
  message: string;
}

export interface DateActivitiesResponse {
  success: boolean;
  message: string;
  data: {
    date: string;
    activities: Activity[];
    count: number;
  };
}

export interface ActivityTypeStat {
  activityType: ActivityType;
  count: number;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    byType: ActivityTypeStat[];
  };
}

export interface DeleteMemoryResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface TimelineFilters {
  page?: number;
  limit?: number;
  activityType?: ActivityType;
}
