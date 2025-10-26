// types/chat.ts
export type SenderType = "system" | "user";

export interface Message {
  id: string;
  userId: string;
  chatId: string;
  text: string;
  senderType: SenderType;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatWithPreview extends Chat {
  lastMessage?: Message;
}

export interface SendMessagePayload {
  chatId: string;
  text: string;
  senderType: SenderType;
}

export interface DeleteMessagePayload {
  messageId: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ChatListResponse {
  chats: Chat[];
}

export interface ChatResponse {
  chat: Chat;
}

export interface MessageResponse {
  message: Message;
}

export interface MessagesResponse {
  messages: Message[];
}
