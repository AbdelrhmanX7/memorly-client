import type { TimelineFilters, Activity } from "@/types/memory";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  getTimeline,
  getActivitiesByDate,
  getActivityStats,
  deleteMemory,
} from "@/service/api/memory";

/**
 * Hook to fetch timeline with pagination
 */
export function useTimeline(filters: TimelineFilters = {}) {
  return useQuery({
    queryKey: ["timeline", filters],
    queryFn: () => getTimeline(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch timeline with infinite scroll
 */
export function useInfiniteTimeline(
  filters: Omit<TimelineFilters, "page"> = {},
) {
  return useInfiniteQuery({
    queryKey: ["timeline-infinite", filters],
    queryFn: ({ pageParam = 1 }) =>
      getTimeline({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasNextPage) {
        return lastPage?.pagination?.currentPage + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch activities for a specific date
 */
export function useActivitiesByDate(date: string | null) {
  return useQuery({
    queryKey: ["activities-by-date", date],
    queryFn: () => {
      if (!date) throw new Error("No date provided");

      return getActivitiesByDate(date);
    },
    enabled: !!date,
  });
}

/**
 * Hook to fetch activity statistics
 */
export function useActivityStats() {
  return useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => getActivityStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to delete a memory
 */
export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoryId: string) => deleteMemory(memoryId),
    onMutate: async (memoryId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["timeline"] });
      await queryClient.cancelQueries({ queryKey: ["timeline-infinite"] });

      // Snapshot previous value
      const previousTimeline = queryClient.getQueryData(["timeline"]);
      const previousInfiniteTimeline = queryClient.getQueryData([
        "timeline-infinite",
      ]);

      // Optimistically update to remove the memory
      queryClient.setQueriesData({ queryKey: ["timeline"] }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            timeline: old.data.timeline
              .map((day: any) => ({
                ...day,
                activities: day.activities.filter(
                  (a: Activity) => a.id !== memoryId,
                ),
                count: day.activities.filter((a: Activity) => a.id !== memoryId)
                  .length,
              }))
              .filter((day: any) => day.count > 0),
          },
        };
      });

      queryClient.setQueriesData(
        { queryKey: ["timeline-infinite"] },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                timeline: page.data.timeline
                  .map((day: any) => ({
                    ...day,
                    activities: day.activities.filter(
                      (a: Activity) => a.id !== memoryId,
                    ),
                    count: day.activities.filter(
                      (a: Activity) => a.id !== memoryId,
                    ).length,
                  }))
                  .filter((day: any) => day.count > 0),
              },
            })),
          };
        },
      );

      return { previousTimeline, previousInfiniteTimeline };
    },
    onError: (_err, _memoryId, context) => {
      // Revert optimistic update on error
      if (context?.previousTimeline) {
        queryClient.setQueryData(["timeline"], context.previousTimeline);
      }
      if (context?.previousInfiniteTimeline) {
        queryClient.setQueryData(
          ["timeline-infinite"],
          context.previousInfiniteTimeline,
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure data is up to date
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      queryClient.invalidateQueries({ queryKey: ["timeline-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["activity-stats"] });
    },
  });
}
