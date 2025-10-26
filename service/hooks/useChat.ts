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
 * Hook to send a message with optimistic updates
 * Message appears immediately in UI before server responds
 */
export function useSendMessage(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload, token),
    // Optimistically update the UI before the API responds
    onMutate: async (payload) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: ["chat", payload.chatId, "messages"],
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData([
        "chat",
        payload.chatId,
        "messages",
      ]);

      // Optimistically add the new message to the cache
      queryClient.setQueryData(
        ["chat", payload.chatId, "messages"],
        (old: any) => {
          const optimisticMessage = {
            id: `temp-${Date.now()}`, // Temporary ID
            userId: "current-user", // Will be replaced by server response
            chatId: payload.chatId,
            text: payload.text,
            senderType: payload.senderType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOptimistic: true, // Flag to identify optimistic messages
          };

          return old ? [...old, optimisticMessage] : [optimisticMessage];
        },
      );

      // Return context with previous messages for rollback
      return { previousMessages };
    },
    // If mutation fails, rollback to previous state
    onError: (_error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["chat", variables.chatId, "messages"],
          context.previousMessages,
        );
      }
    },
    // Always refetch after success or error to sync with server
    onSettled: (_data, _error, variables) => {
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
      console.log("Starting stream for chat:", chatId, "with text:", text);
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
            console.log("Received chunk:", chunk);
            setStreamedContent((prev) => prev + chunk);
          },
          // onComplete callback - refresh messages
          () => {
            console.log("Streaming completed successfully");
            setIsStreaming(false);
            queryClient.invalidateQueries({
              queryKey: ["chat", chatId, "messages"],
            });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
          },
          // onError callback
          (err: Error) => {
            console.error("Streaming error:", err);
            setError(err);
            setIsStreaming(false);
          },
        );
      } catch (err) {
        console.error("Stream exception:", err);
        setError(err instanceof Error ? err : new Error("Streaming failed"));
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
