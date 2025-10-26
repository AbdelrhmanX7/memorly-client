/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextHead from "next/head";
import {
  UserCircleIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";

import { BottomNavbar } from "@/components/bottom-navbar";
import { siteConfig } from "@/config/site";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");

      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <>
      <NextHead>
        <title>Profile | {siteConfig.name}</title>
        <meta content="noindex, nofollow" name="robots" />
      </NextHead>

      <div className="relative flex h-fit flex-col pb-20">
        <div className="absolute inset-0 grid-background pointer-events-none" />

        <main className="relative z-10 flex-1 px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <UserCircleIcon className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold">Your Profile</h1>
            </div>

            <div className="mb-6 rounded-large bg-content1 p-6 shadow-medium">
              <div className="mb-4">
                <label className="mb-1 block text-sm text-default-500">
                  Username
                </label>
                <p className="text-lg font-semibold">{user.username}</p>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm text-default-500">
                  Email
                </label>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
            </div>

            {/* Profile Menu Items */}
            <div className="mb-6 rounded-large bg-content1 shadow-medium overflow-hidden">
              <button
                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-default-100 border-b border-divider"
                onClick={() => router.push("/friends")}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-warning/20 p-2">
                    <UsersIcon className="h-5 w-5 text-warning" />
                  </div>
                  <span className="font-semibold">Friends</span>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-default-400" />
              </button>

              <button
                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-default-100"
                onClick={() => {
                  // TODO: Navigate to settings page
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-default/20 p-2">
                    <Cog6ToothIcon className="h-5 w-5 text-default-600" />
                  </div>
                  <span className="font-semibold">Settings</span>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-default-400" />
              </button>
            </div>

            <Button
              fullWidth
              className="font-semibold"
              color="danger"
              size="lg"
              startContent={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
              variant="shadow"
              onPress={handleLogout}
            >
              Logout
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
