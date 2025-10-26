// components/new-chat-form.tsx
import { Button } from "@heroui/button";
import { MessageSquarePlus } from "lucide-react";

import { useCreateChat } from "@/service/hooks/useChat";

interface NewChatFormProps {
  token: string;
}

export function NewChatForm({ token }: NewChatFormProps) {
  const createChat = useCreateChat(token);

  const handleCreateChat = () => {
    createChat.mutate();
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
        <MessageSquarePlus className="h-12 w-12 text-primary-600" />
      </div>

      <div className="max-w-md">
        <h2 className="text-2xl font-bold">Start New Conversation</h2>
        <p className="mt-2 text-default-500">
          Create a new chat session and start asking questions or having a
          conversation with the system
        </p>
      </div>

      <Button
        color="primary"
        isLoading={createChat.isPending}
        size="lg"
        startContent={<MessageSquarePlus className="h-5 w-5" />}
        onPress={handleCreateChat}
      >
        Create New Chat
      </Button>

      {createChat.isError && (
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-3 text-sm text-danger-600">
          Failed to create chat. Please try again.
        </div>
      )}
    </div>
  );
}
