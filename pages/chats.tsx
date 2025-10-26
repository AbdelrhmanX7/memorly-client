import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextHead from "next/head";
import { Tabs, Tab } from "@heroui/tabs";
import { MessageSquarePlus, History } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ChatList } from "@/components/chat-list";
import { NewChatForm } from "@/components/new-chat-form";

export default function ChatsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("new");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");

      return;
    }

    setToken(storedToken);
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <NextHead>
        <title>Chats | {siteConfig.name}</title>
        <meta content="noindex, nofollow" name="robots" />
      </NextHead>

      <div className="relative flex h-fit flex-col">
        <div className="absolute inset-0 grid-background pointer-events-none" />

        <main className="relative z-10 flex-1 py-6">
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold">Chat</h1>
              <p className="mt-2 text-lg text-default-500">
                Have conversations with the system
              </p>
            </div>

            <Tabs
              fullWidth
              aria-label="Chat tabs"
              className="mb-6"
              color="primary"
              selectedKey={selectedTab}
              size="lg"
              variant="bordered"
              onSelectionChange={(key) => setSelectedTab(key as string)}
            >
              <Tab
                key="new"
                title={
                  <div className="flex items-center gap-2">
                    <MessageSquarePlus className="h-4 w-4" />
                    <span>New Chat</span>
                  </div>
                }
              />
              <Tab
                key="previous"
                title={
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Previous Chats</span>
                  </div>
                }
              />
            </Tabs>

            <div className="min-h-[400px]">
              {selectedTab === "new" ? (
                <NewChatForm token={token} />
              ) : (
                <ChatList token={token} />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
