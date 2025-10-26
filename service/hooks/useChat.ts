// service/hooks/useChat.ts
import type { Chat, SendMessagePayload } from "@/types/chat";

import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import {
  createChat,
  deleteChat,
  deleteMessage,
  fetchChatById,
  fetchChatMessages,
  fetchChats,
  sendMessage,
  generateStreamingResponse,
} from "@/service/api/chat";

/**
 * Hook to fetch all chats
 * Sorted by most recently updated
 */
export function useChats(token: string) {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => fetchChats(token),
    enabled: !!token,
  });
}

/**
 * Hook to fetch a single chat by ID
 */
export function useChatById(chatId: string, token: string) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatById(chatId, token),
    enabled: !!chatId && !!token,
  });
}

/**
 * Hook to fetch all messages for a chat
 */
export function useChatMessages(chatId: string, token: string) {
  return useQuery({
    queryKey: ["chat", chatId, "messages"],
    queryFn: () => fetchChatMessages(chatId, token),
    enabled: !!chatId && !!token,
  });
}

/**
 * Hook to create a new chat
 * Automatically redirects to the new chat page on success
 */
export function useCreateChat(token: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => createChat(token),
    onSuccess: (chat: Chat) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.push(`/chat/${chat.id}`);
    },
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat", variables.chatId, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/**
 * Hook to delete a chat
 */
export function useDeleteChat(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId }: { messageId: string; chatId: string }) =>
      deleteMessage(messageId, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat", variables.chatId, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/**
 * Hook for streaming AI responses
 * Returns streaming state and a function to start streaming
 */
export function useStreamingResponse(token: string) {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const startStreaming = useCallback(
    async (chatId: string, text: string, limit?: number) => {
      setIsStreaming(true);
      setStreamedContent("");
      setError(null);

      try {
        await generateStreamingResponse(
          chatId,
          text,
          token,
          limit,
          // onChunk callback - updates UI in real-time
          (chunk: string) => {
            setStreamedContent((prev) => prev + chunk);
          },
          // onComplete callback - refresh messages
          () => {
            setIsStreaming(false);
            queryClient.invalidateQueries({
              queryKey: ["chat", chatId, "messages"],
            });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
          },
          // onError callback
          (err: Error) => {
            setError(err);
            setIsStreaming(false);
          },
        );
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Streaming failed"),
        );
        setIsStreaming(false);
      }
    },
    [token, queryClient],
  );

  const resetStream = useCallback(() => {
    setStreamedContent("");
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    isStreaming,
    streamedContent,
    error,
    startStreaming,
    resetStream,
  };
}
