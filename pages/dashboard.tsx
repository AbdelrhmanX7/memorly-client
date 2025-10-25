import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextHead from "next/head";
import { UserIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/card";

import { siteConfig } from "@/config/site";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push("/login");

      return;
    }

    try {
      const parsedUser = JSON.parse(userData);

      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.push("/login");
    }
  }, [router]);

  const pageTitle = "Dashboard";
  const pageDescription = "Your personal Memorly dashboard";

  if (!user) {
    return null; // Show nothing while checking authentication
  }

  return (
    <>
      <NextHead>
        <title>
          {pageTitle} | {siteConfig.name}
        </title>
        <meta content={pageDescription} name="description" />
        <meta content="noindex, nofollow" name="robots" />
      </NextHead>

      <div className="relative flex h-full flex-col pb-20">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-background pointer-events-none" />

        {/* Main Content */}
        <main className="relative z-10 flex-1 px-2 py-8">
          <div className="mx-auto max-w-4xl">
            {/* Welcome Section */}
            <Card className="mb-8 px-3">
              <div className="flex items-start gap-4 py-4">
                <div className="rounded-full bg-primary/20 w-fit p-4 text-primary">
                  <UserIcon className="font-bold" width={24} />
                </div>
                <div className="text-start">
                  <h1 className="mb-2 text-lg font-bold">
                    Welcome, {user.username}!
                  </h1>
                  <p className="text-sm text-default-500">
                    Ready to capture and preserve your precious memories?
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4 mb-8">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-large border-2 border-primary bg-primary/20 p-4 text-start ">
                  <div className="mb-1 text-3xl font-bold">0</div>
                  <div className="text-sm ">Memories</div>
                </div>
                <div className="rounded-large border-2 border-secondary bg-secondary/20 p-4 text-start ">
                  <div className="mb-1 text-3xl font-bold">0</div>
                  <div className="text-sm">Notes</div>
                </div>
                <div className="rounded-large border-2 border-success bg-success/20 p-4 text-start ">
                  <div className="mb-1 text-3xl font-bold ">0</div>
                  <div className="text-sm">Chats</div>
                </div>
                <div className="rounded-large border-2 border-warning bg-warning/20 p-4 text-start">
                  <div className="mb-1 text-3xl font-bold ">0</div>
                  <div className="text-sm">Friends</div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
              <div className="rounded-large bg-content1 p-8 text-center shadow-medium">
                <p className="text-default-400">
                  No recent activity yet. Start by uploading your first memory!
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <button
                  className="rounded-large bg-gradient-to-br from-primary to-secondary p-6 text-left transition-transform hover:scale-105"
                  onClick={() => router.push("/upload")}
                >
                  <h3 className="mb-2 text-lg font-bold text-white">
                    Upload Memory
                  </h3>
                  <p className="text-sm text-white/80">
                    Add photos or videos to your collection
                  </p>
                </button>

                <button
                  className="rounded-large bg-gradient-to-br from-success to-success-300 p-6 text-left transition-transform hover:scale-105"
                  onClick={() => router.push("/notes")}
                >
                  <h3 className="mb-2 text-lg font-bold text-white">
                    Create Note
                  </h3>
                  <p className="text-sm text-white/80">
                    Write down your thoughts and ideas
                  </p>
                </button>

                <button
                  className="rounded-large bg-gradient-to-br from-warning to-warning-300 p-6 text-left transition-transform hover:scale-105"
                  onClick={() => router.push("/chats")}
                >
                  <h3 className="mb-2 text-lg font-bold text-white">
                    Start Chat
                  </h3>
                  <p className="text-sm text-white/80">
                    Connect with friends and share memories
                  </p>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
      </div>
    </>
  );
}
