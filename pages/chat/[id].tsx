// pages/chat/[id].tsx
import type { Message } from "@/types/chat";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import NextHead from "next/head";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  ArrowLeft,
  Send,
  Bot,
  User as UserIcon,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  useChatMessages,
  useDeleteChat,
  useDeleteMessage,
  useStreamingResponse,
} from "@/service/hooks/useChat";

const MAX_MESSAGE_LENGTH = 5000;

export default function ChatConversationPage() {
  const router = useRouter();
  const { id: chatId } = router.query;
  const [messageInput, setMessageInput] = useState("");
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messagesMaxHeight, setMessagesMaxHeight] = useState("600px");
  const [deleteChatModalOpen, setDeleteChatModalOpen] = useState(false);
  const [deleteMessageModalOpen, setDeleteMessageModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");

      return;
    }

    setToken(storedToken);
    setIsAuthenticated(true);
  }, [router]);

  const {
    data: messages,
    isLoading,
    error,
  } = useChatMessages(chatId as string, token);
  const deleteChat = useDeleteChat(token);
  const deleteMessageMutation = useDeleteMessage(token);
  const {
    isStreaming,
    streamedContent,
    error: streamError,
    startStreaming,
  } = useStreamingResponse(token);

  // Calculate messages max height dynamically
  useEffect(() => {
    const calculateMessagesHeight = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const inputHeight = inputRef.current?.offsetHeight || 0;
      const topNavbarHeight = 64; // Top navbar height
      const bottomNavbarHeight = 84; // Bottom navbar height
      const padding = 65; // Additional padding/margins

      const availableHeight =
        viewportHeight -
        headerHeight -
        inputHeight -
        topNavbarHeight -
        bottomNavbarHeight -
        padding;

      setMessagesMaxHeight(`${availableHeight}px`);
    };

    calculateMessagesHeight();
    window.addEventListener("resize", calculateMessagesHeight);

    return () => window.removeEventListener("resize", calculateMessagesHeight);
  }, [messageInput]);

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedContent]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !chatId) {
      return;
    }

    if (messageInput.length > MAX_MESSAGE_LENGTH) {
      addToast({
        title: "Error",
        description: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`,
        color: "danger",
      });

      return;
    }

    const userMessage = messageInput.trim();

    setMessageInput("");

    try {
      // Start streaming AI response
      await startStreaming(chatId as string, userMessage, 10);
    } catch (error) {
      console.error("Failed to send message:", error);
      addToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        color: "danger",
      });
    }
  };

  const handleDeleteChatClick = () => {
    setDeleteChatModalOpen(true);
  };

  const handleConfirmDeleteChat = async () => {
    if (!chatId) return;

    try {
      await deleteChat.mutateAsync(chatId as string);
      addToast({
        title: "Success",
        description: "Chat deleted successfully",
        color: "success",
      });
      setDeleteChatModalOpen(false);
      router.push("/chats");
    } catch (error) {
      console.error("Failed to delete chat:", error);
      addToast({
        title: "Error",
        description: "Failed to delete chat. Please try again.",
        color: "danger",
      });
    }
  };

  const handleCancelDeleteChat = () => {
    setDeleteChatModalOpen(false);
  };

  const handleDeleteMessageClick = (messageId: string) => {
    setMessageToDelete(messageId);
    setDeleteMessageModalOpen(true);
  };

  const handleConfirmDeleteMessage = async () => {
    if (!messageToDelete || !chatId) return;

    try {
      await deleteMessageMutation.mutateAsync({
        messageId: messageToDelete,
        chatId: chatId as string,
      });
      addToast({
        title: "Success",
        description: "Message deleted successfully",
        color: "success",
      });
      setDeleteMessageModalOpen(false);
      setMessageToDelete(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
      addToast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        color: "danger",
      });
    }
  };

  const handleCancelDeleteMessage = () => {
    setDeleteMessageModalOpen(false);
    setMessageToDelete(null);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <>
        <NextHead>
          <title>Chat | {siteConfig.name}</title>
          <meta content="noindex, nofollow" name="robots" />
        </NextHead>
        <div className="relative flex h-fit flex-col pb-20">
          <div className="absolute inset-0 grid-background pointer-events-none" />
          <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
            <Spinner size="lg" />
          </main>
        </div>
      </>
    );
  }

  if (error || !messages) {
    return (
      <>
        <NextHead>
          <title>Chat | {siteConfig.name}</title>
          <meta content="noindex, nofollow" name="robots" />
        </NextHead>
        <div className="relative flex h-fit flex-col pb-20">
          <div className="absolute inset-0 grid-background pointer-events-none" />
          <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
            <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 text-center text-danger-600">
              <p>Failed to load chat. Please try again.</p>
              <Button
                className="mt-4"
                color="danger"
                variant="flat"
                onPress={() => router.push("/chats")}
              >
                Back to Chats
              </Button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <NextHead>
        <title>
          Chat #{chatId?.toString().slice(-6)} | {siteConfig.name}
        </title>
        <meta content="noindex, nofollow" name="robots" />
      </NextHead>
      <div className="relative flex h-full flex-col">
        <div className="absolute inset-0 grid-background pointer-events-none" />
        <main className="relative z-10 flex flex-col px-4 py-4 h-full">
          {/* Header */}
          <div
            ref={headerRef}
            className="mb-4 flex items-center justify-between border-b border-divider pb-4"
          >
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => router.push("/chats")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  Chat #{chatId?.toString().slice(-6)}
                </h1>
                <p className="text-sm text-default-500">
                  {messages.length} message
                  {messages.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              color="danger"
              isLoading={deleteChat.isPending}
              size="sm"
              variant="flat"
              onPress={handleDeleteChatClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div
            className="mb-4 flex flex-col gap-2 overflow-y-auto px-2"
            style={{ maxHeight: messagesMaxHeight }}
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-default-500">
                <div>
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="mt-2 text-sm">
                    Start the conversation by sending a message below
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message: Message, index: number) => {
                const isUser = message.senderType === "user";
                const showAvatar =
                  index === messages.length - 1 ||
                  messages[index + 1]?.senderType !== message.senderType;
                const isFirstInGroup =
                  index === 0 ||
                  messages[index - 1]?.senderType !== message.senderType;
                const isLastInGroup =
                  index === messages.length - 1 ||
                  messages[index + 1]?.senderType !== message.senderType;

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      isUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar - only show for last message in group */}
                    {showAvatar ? (
                      <Avatar
                        className="mb-1 flex-shrink-0"
                        color={isUser ? "primary" : "secondary"}
                        icon={
                          isUser ? (
                            <UserIcon className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )
                        }
                        size="sm"
                      />
                    ) : (
                      <div className="h-8 w-8 flex-shrink-0" />
                    )}

                    {/* Message bubble */}
                    <div
                      className={`group relative flex max-w-[70%] flex-col ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Message content */}
                      <div
                        className={`relative px-4 py-2 ${
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-content2 text-foreground"
                        } ${
                          isFirstInGroup && isLastInGroup
                            ? "rounded-[20px]"
                            : isFirstInGroup
                              ? isUser
                                ? "rounded-[20px] rounded-br-md"
                                : "rounded-[20px] rounded-bl-md"
                              : isLastInGroup
                                ? isUser
                                  ? "rounded-[20px] rounded-tr-md"
                                  : "rounded-[20px] rounded-tl-md"
                                : isUser
                                  ? "rounded-[20px] rounded-br-md rounded-tr-md"
                                  : "rounded-[20px] rounded-bl-md rounded-tl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                          {message.text}
                        </p>

                        {/* Delete button - only for user messages */}
                        {isUser && (
                          <Button
                            isIconOnly
                            className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                            color="danger"
                            isLoading={deleteMessageMutation.isPending}
                            size="sm"
                            variant="light"
                            onPress={() => handleDeleteMessageClick(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {/* Timestamp - only show for last message in group */}
                      {isLastInGroup && (
                        <p
                          className={`mt-1 px-2 text-xs text-default-400 ${
                            isUser ? "text-right" : "text-left"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Streaming AI Response */}
            {isStreaming && streamedContent && (
              <div className="flex items-start gap-2">
                {/* Avatar for system message */}
                <Avatar
                  className="mb-1 flex-shrink-0"
                  color="secondary"
                  icon={<Bot className="h-4 w-4" />}
                  size="sm"
                />

                {/* Streaming message bubble */}
                <div className="flex max-w-[70%] flex-col items-start">
                  <div className="relative rounded-[20px] rounded-bl-md bg-content2 px-4 py-2 text-foreground">
                    <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                      {streamedContent}
                      <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-foreground" />
                    </p>
                  </div>
                  <p className="mt-1 px-2 text-left text-xs text-default-400">
                    Generating...
                  </p>
                </div>
              </div>
            )}

            {/* Streaming Error */}
            {streamError && (
              <div className="flex items-start gap-2">
                <Avatar
                  className="mb-1 flex-shrink-0"
                  color="danger"
                  icon={<AlertTriangle className="h-4 w-4" />}
                  size="sm"
                />
                <div className="flex max-w-[70%] flex-col items-start">
                  <div className="relative rounded-[20px] rounded-bl-md border border-danger-200 bg-danger-50 px-4 py-2 text-danger-600">
                    <p className="text-[15px]">
                      Failed to generate response. Please try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            ref={inputRef}
            className="border-t border-divider bg-background pt-4 mt-auto"
          >
            <form className="flex gap-2" onSubmit={handleSendMessage}>
              <div className="flex-1">
                <Textarea
                  isDisabled={isStreaming}
                  maxLength={MAX_MESSAGE_LENGTH}
                  maxRows={4}
                  minRows={1}
                  placeholder={
                    isStreaming
                      ? "Generating response..."
                      : "Type your message... (Ctrl+Enter to send)"
                  }
                  value={messageInput}
                  variant="bordered"
                  onKeyDown={handleKeyDown}
                  onValueChange={setMessageInput}
                />
                <div className="mt-1 text-right text-xs text-default-400">
                  {messageInput.length} / {MAX_MESSAGE_LENGTH}
                </div>
              </div>
              <Button
                isIconOnly
                color="primary"
                isDisabled={!messageInput.trim() || isStreaming}
                isLoading={isStreaming}
                type="submit"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </main>
      </div>

      {/* Delete Chat Modal */}
      <Modal isOpen={deleteChatModalOpen} onOpenChange={setDeleteChatModalOpen}>
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
                  onPress={handleCancelDeleteChat}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={deleteChat.isPending}
                  onPress={handleConfirmDeleteChat}
                >
                  Delete Permanently
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Message Modal */}
      <Modal
        isOpen={deleteMessageModalOpen}
        onOpenChange={setDeleteMessageModalOpen}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
                <span>Delete Message</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-default-700">
                  Are you sure you want to delete this message? This action is{" "}
                  <strong className="text-danger">permanent</strong> and cannot
                  be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={handleCancelDeleteMessage}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={deleteMessageMutation.isPending}
                  onPress={handleConfirmDeleteMessage}
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
