// service/api/chat.ts
import type {
  ApiResponse,
  Chat,
  ChatListResponse,
  ChatResponse,
  Message,
  MessageResponse,
  MessagesResponse,
  SendMessagePayload,
} from "@/types/chat";

import axios from "axios";

/**
 * Fetches list of all chats for the authenticated user
 * Sorted by most recently updated
 */
export async function fetchChats(_token: string): Promise<Chat[]> {
  try {
    const response =
      await axios.get<ApiResponse<ChatListResponse>>("/chat/list");

    return response.data.data.chats;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to fetch chats";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Fetches a single chat by ID
 */
export async function fetchChatById(
  chatId: string,
  _token: string,
): Promise<Chat> {
  try {
    const response = await axios.get<ApiResponse<ChatResponse>>(
      `/chat/${chatId}`,
    );

    return response.data.data.chat;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to fetch chat details";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Fetches all messages for a specific chat
 * Sorted chronologically (oldest first)
 */
export async function fetchChatMessages(
  chatId: string,
  _token: string,
): Promise<Message[]> {
  try {
    const response = await axios.get<ApiResponse<MessagesResponse>>(
      `/chat/${chatId}/messages`,
    );

    return response.data.data.messages;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to fetch messages";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Creates a new chat session
 */
export async function createChat(_token: string): Promise<Chat> {
  try {
    const response =
      await axios.post<ApiResponse<ChatResponse>>("/chat/create");

    return response.data.data.chat;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to create chat";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Sends a message in a chat
 */
export async function sendMessage(
  payload: SendMessagePayload,
  _token: string,
): Promise<Message> {
  // Validate message text
  if (!payload.text.trim()) {
    throw new Error("Message cannot be empty");
  }

  if (payload.text.length > 5000) {
    throw new Error("Message is too long (max 5000 characters)");
  }

  try {
    const response = await axios.post<ApiResponse<MessageResponse>>(
      "/chat/message/create",
      {
        chatId: payload.chatId,
        text: payload.text.trim(),
        senderType: payload.senderType,
      },
    );

    return response.data.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to send message";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Deletes a chat and all its messages
 */
export async function deleteChat(
  chatId: string,
  _token: string,
): Promise<void> {
  try {
    await axios.delete(`/chat/${chatId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to delete chat";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Deletes a specific message from a chat
 */
export async function deleteMessage(
  messageId: string,
  _token: string,
): Promise<void> {
  try {
    await axios.delete(`/chat/message/${messageId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to delete message";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Generates streaming AI response for a chat message
 * Uses Server-Sent Events (SSE) for real-time streaming
 * Note: Uses fetch instead of axios because axios doesn't support SSE streams in browser
 */
export async function generateStreamingResponse(
  chatId: string,
  text: string,
  token: string,
  limit?: number,
  onChunk?: (chunk: string) => void,
  onComplete?: (fullResponse: string) => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API;

  try {
    const response = await fetch(`${API_BASE_URL}/chat/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replaceAll('"', "")}`,
      },
      body: JSON.stringify({
        chatId,
        text,
        limit: limit || 10,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(errorData.message || "Failed to generate response");
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let buffer = ""; // Buffer to accumulate incomplete chunks

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Process any remaining buffer
        if (buffer.trim()) {
          console.warn("Unprocessed buffer at end:", buffer);
        }
        break;
      }

      // Decode the chunk and add to buffer
      const chunk = decoder.decode(value, { stream: true });

      buffer += chunk;

      // Split by newlines, but keep the last incomplete line in buffer
      const lines = buffer.split("\n");

      buffer = lines.pop() || ""; // Keep the last incomplete line

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) continue;

        // Handle SSE format: "data: ..."
        if (trimmedLine.startsWith("data:")) {
          const data = trimmedLine.slice(5).trim(); // Remove "data:" prefix

          if (data === "[DONE]") {
            if (onComplete) {
              onComplete(fullResponse);
            }

            return;
          }

          // Skip empty data
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.content) {
              fullResponse += parsed.content;

              if (onChunk) {
                onChunk(parsed.content);
              }
            }
          } catch (e) {
            console.error("Failed to parse SSE data:", data, e);
          }
        }
      }
    }

    if (onComplete) {
      onComplete(fullResponse);
    }
  } catch (error) {
    if (onError) {
      onError(
        error instanceof Error ? error : new Error("Streaming error occurred"),
      );
    }

    throw error;
  }
}
