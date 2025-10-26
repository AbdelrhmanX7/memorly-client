import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextHead from "next/head";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import { BottomNavbar } from "@/components/bottom-navbar";
import { siteConfig } from "@/config/site";

export default function ChatsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");

      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <NextHead>
        <title>Chats | {siteConfig.name}</title>
        <meta content="noindex, nofollow" name="robots" />
      </NextHead>

      <div className="relative flex h-fit flex-col pb-20">
        <div className="absolute inset-0 grid-background pointer-events-none" />

        <main className="relative z-10 flex-1 px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold">Chats</h1>
              <p className="text-default-500">
                Connect and share memories with friends
              </p>
            </div>

            <div className="rounded-large bg-content1 p-12 text-center shadow-medium">
              <p className="text-lg text-default-400">
                No chats yet. Start a conversation with your friends!
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
