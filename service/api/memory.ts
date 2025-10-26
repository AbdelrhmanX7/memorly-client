import type {
  TimelineResponse,
  DateActivitiesResponse,
  StatsResponse,
  DeleteMemoryResponse,
  TimelineFilters,
} from "@/types/memory";

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

/**
 * Get user's activity timeline with pagination
 */
export async function getTimeline(
  filters: TimelineFilters = {},
): Promise<TimelineResponse> {
  try {
    const params: Record<string, string> = {};

    if (filters.page) params.page = filters.page.toString();
    if (filters.limit) params.limit = filters.limit.toString();
    if (filters.activityType) params.activityType = filters.activityType;

    const response = await axios.get<{ data: TimelineResponse }>(
      `${API_BASE_URL}/memories/timeline`,
      { params },
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to fetch timeline";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Get activities for a specific date
 */
export async function getActivitiesByDate(
  date: string,
): Promise<DateActivitiesResponse> {
  try {
    const response = await axios.get<{ data: DateActivitiesResponse }>(
      `${API_BASE_URL}/memories/date/${date}`,
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to fetch activities";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(): Promise<StatsResponse> {
  try {
    const response = await axios.get<{ data: StatsResponse }>(
      `${API_BASE_URL}/memories/stats`,
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to fetch stats";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Delete a specific memory
 */
export async function deleteMemory(
  memoryId: string,
): Promise<DeleteMemoryResponse> {
  try {
    const response = await axios.delete<{ data: DeleteMemoryResponse }>(
      `${API_BASE_URL}/memories/${memoryId}`,
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to delete memory";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}
