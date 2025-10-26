/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// components/chat-list.tsx
import type { Chat, ChatWithPreview } from "@/types/chat";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { MessageCircle, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/router";
import { addToast } from "@heroui/react";

import { useChats, useDeleteChat } from "@/service/hooks/useChat";
import { fetchChatMessages } from "@/service/api/chat";

interface ChatListProps {
  token: string;
}

export function ChatList({ token }: ChatListProps) {
  const router = useRouter();
  const { data: chats, isLoading, error } = useChats(token);
  const deleteChat = useDeleteChat(token);
  const [chatsWithPreviews, setChatsWithPreviews] = useState<ChatWithPreview[]>(
    [],
  );
  const [loadingPreviews, setLoadingPreviews] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!chats || chats.length === 0) {
      setChatsWithPreviews([]);

      return;
    }

    const fetchPreviews = async () => {
      setLoadingPreviews(true);

      try {
        const chatsWithMessages = await Promise.all(
          chats.map(async (chat: Chat) => {
            try {
              const messages = await fetchChatMessages(chat.id, token);
              const lastMessage = messages[messages.length - 1];

              return {
                ...chat,
                lastMessage,
              };
            } catch {
              return {
                ...chat,
                lastMessage: undefined,
              };
            }
          }),
        );

        setChatsWithPreviews(chatsWithMessages);
      } catch (error) {
        console.error("Failed to fetch message previews:", error);
        setChatsWithPreviews(chats);
      } finally {
        setLoadingPreviews(false);
      }
    };

    fetchPreviews();
  }, [chats, token]);

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleDeleteClick = (chatId: string) => {
    setChatToDelete(chatId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      await deleteChat.mutateAsync(chatToDelete);
      addToast({
        title: "Success",
        description: "Chat deleted successfully",
        color: "success",
      });
      setDeleteModalOpen(false);
      setChatToDelete(null);
    } catch {
      addToast({
        title: "Error",
        description: "Failed to delete chat. Please try again.",
        color: "danger",
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setChatToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 text-center text-danger-600">
        <p>Failed to load chats. Please try again.</p>
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="py-12 text-center text-default-500">
        <MessageCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p className="text-lg font-medium">No previous chats</p>
        <p className="mt-2 text-sm">Start a new conversation to see it here</p>
      </div>
    );
  }

  const displayChats = chatsWithPreviews.length > 0 ? chatsWithPreviews : chats;

  return (
    <>
      <div className="space-y-3">
        {loadingPreviews && chatsWithPreviews.length === 0 && (
          <div className="mb-4 text-center text-sm text-default-400">
            Loading message previews...
          </div>
        )}

        {displayChats.map((chat: ChatWithPreview) => (
          <div
            key={chat.id}
            className="group relative cursor-pointer rounded-lg border border-divider bg-content1 p-4 transition-all hover:border-primary hover:shadow-md"
            onClick={() => handleChatClick(chat.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-1 items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="truncate text-base font-semibold">
                    Chat #{chat.id.slice(-6)}
                  </h3>
                  <p className="mt-1 text-xs text-default-500">
                    {new Date(chat.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  isIconOnly
                  color="danger"
                  isLoading={deleteChat.isPending}
                  size="sm"
                  variant="light"
                  onPress={() => handleDeleteClick(chat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {chat.lastMessage && (
              <div className="mt-3 border-t border-divider pt-3">
                <p className="line-clamp-2 text-sm text-default-600">
                  <span className="font-medium text-default-900">
                    {chat.lastMessage.senderType === "system"
                      ? "System"
                      : "You"}
                    :
                  </span>{" "}
                  {chat.lastMessage.text}
                </p>
                <p className="mt-2 text-xs text-default-400">
                  {new Date(chat.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
                <span>Permanent Delete</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-default-700">
                  Are you sure you want to delete this chat? This action is{" "}
                  <strong className="text-danger">permanent</strong> and cannot
                  be undone.
                </p>
                <p className="mt-2 text-sm text-default-500">
                  All messages in this conversation will be permanently removed.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={handleCancelDelete}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={deleteChat.isPending}
                  onPress={handleConfirmDelete}
                >
                  Delete Permanently
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
