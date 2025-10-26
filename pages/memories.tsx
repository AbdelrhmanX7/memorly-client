import type { ActivityType } from "@/types/memory";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import NextHead from "next/head";
import {
  Button,
  Spinner,
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@heroui/react";

import { siteConfig } from "@/config/site";
import { TimelineDay } from "@/components/timeline-day";
import {
  useInfiniteTimeline,
  useDeleteMemory,
} from "@/service/hooks/useMemories";

const activityTypeOptions = [
  { value: "", label: "All Activities" },
  { value: "file_upload", label: "File Uploads" },
  { value: "message_sent", label: "Messages" },
  { value: "chat_created", label: "Chats Created" },
  { value: "friend_request_sent", label: "Friend Requests Sent" },
  { value: "friend_request_accepted", label: "Friends Accepted" },
  { value: "friend_request_rejected", label: "Requests Declined" },
];

export default function MemoriesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<ActivityType | "">("");
  const [deletingMemoryId, setDeletingMemoryId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Intersection observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");

      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTimeline(
    filter ? { activityType: filter as ActivityType } : {},
  );

  const deleteMemoryMutation = useDeleteMemory();

  const handleDeleteMemory = useCallback(
    async (memoryId: string) => {
      setDeletingMemoryId(memoryId);
      try {
        await deleteMemoryMutation.mutateAsync(memoryId);
      } catch (err) {
        console.error("Failed to delete memory:", err);
      } finally {
        setDeletingMemoryId(null);
      }
    },
    [deleteMemoryMutation],
  );

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <>
        <NextHead>
          <title>Memories | {siteConfig.name}</title>
          <meta content="noindex, nofollow" name="robots" />
        </NextHead>

        <div className="relative flex h-fit flex-col pb-20">
          <div className="absolute inset-0 grid-background pointer-events-none" />

          <main className="relative z-10 flex-1 px-4 py-8">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
              <Spinner label="Loading your memories..." size="lg" />
            </section>
          </main>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <NextHead>
          <title>Memories | {siteConfig.name}</title>
          <meta content="noindex, nofollow" name="robots" />
        </NextHead>

        <div className="relative flex h-fit flex-col pb-20">
          <div className="absolute inset-0 grid-background pointer-events-none" />

          <main className="relative z-10 flex-1 px-4 py-8">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
              <Card className="max-w-md">
                <CardBody className="text-center py-8">
                  <p className="text-lg font-semibold text-danger mb-2">
                    Failed to load memories
                  </p>
                  <p className="text-sm text-foreground-500 mb-4">
                    {error?.message || "An error occurred"}
                  </p>
                  <Button
                    color="primary"
                    onPress={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </CardBody>
              </Card>
            </section>
          </main>
        </div>
      </>
    );
  }

  const allTimeline = data?.pages.flatMap((page) => page.timeline) || [];
  const hasActivities = allTimeline.length > 0;

  return (
    <>
      <NextHead>
        <title>Memories | {siteConfig.name}</title>
        <meta content="noindex, nofollow" name="robots" />
      </NextHead>

      <div className="relative flex flex-col h-fit py-6">
        <div className="absolute inset-0 grid-background pointer-events-none" />

        <main className="relative z-10 flex-1 h-full">
          <section className="flex flex-col gap-4 ">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold">Memories</h1>
                <p className="text-foreground-500 mt-2">
                  Your timeline of activities and moments
                </p>
              </div>

              {/* Filter */}
              <div className="w-full md:w-64">
                <Select
                  label="Filter by activity type"
                  selectedKeys={filter ? [filter] : [""]}
                  variant="bordered"
                  onChange={(e) =>
                    setFilter(e.target.value as ActivityType | "")
                  }
                >
                  {activityTypeOptions.map((option) => (
                    <SelectItem key={option.value}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Timeline */}
            {hasActivities ? (
              <div className="flex flex-col">
                {allTimeline.map((day) => (
                  <TimelineDay
                    key={day.date}
                    deletingMemoryId={deletingMemoryId}
                    timelineDay={day}
                    onDeleteMemory={handleDeleteMemory}
                  />
                ))}

                {/* Infinite scroll trigger */}
                <div ref={observerTarget} className="py-4 flex justify-center">
                  {isFetchingNextPage && <Spinner label="Loading more..." />}
                  {!hasNextPage && allTimeline.length > 0 && (
                    <p className="text-sm text-foreground-400">
                      You&apos;ve reached the end of your timeline
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <Card className="mt-8">
                <CardBody className="text-center py-12">
                  <span className="text-6xl mb-4 block">✨</span>
                  <h3 className="text-xl font-semibold mb-2">
                    No memories yet
                  </h3>
                  <p className="text-foreground-500 mb-4">
                    Your timeline will appear here once you start creating
                    memories.
                  </p>
                  <p className="text-foreground-400 text-sm mb-6">
                    Create a chat, upload videos or images, or add friends to
                    see your activity timeline.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      color="primary"
                      onPress={() => router.push("/chats")}
                    >
                      Create a Chat
                    </Button>
                    <Button
                      color="secondary"
                      variant="flat"
                      onPress={() => router.push("/dashboard")}
                    >
                      Upload Files
                    </Button>
                    <Button
                      color="default"
                      variant="bordered"
                      onPress={() => router.push("/friends")}
                    >
                      Add Friends
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
