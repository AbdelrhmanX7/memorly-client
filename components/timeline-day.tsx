import type { TimelineDay as TimelineDayType } from "@/types/memory";

import { ActivityCard } from "./activity-card";

interface TimelineDayProps {
  timelineDay: TimelineDayType;
  onDeleteMemory?: (memoryId: string) => void;
  deletingMemoryId?: string | null;
}

export function TimelineDay({
  timelineDay,
  onDeleteMemory,
  deletingMemoryId,
}: TimelineDayProps) {
  const formatDate = (dateString: string) => {
    // Get today's and yesterday's dates in YYYY-MM-DD format
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
    const todayDay = String(today.getDate()).padStart(2, "0");
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yesterdayDay = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayStr = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

    // Compare with the date string directly
    if (dateString === todayStr) {
      return "Today";
    } else if (dateString === yesterdayStr) {
      return "Yesterday";
    } else {
      // Parse the date for formatting
      const [year, month, day] = dateString.split("-");
      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const isToday = () => {
    // Get today's date in YYYY-MM-DD format in local timezone
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    // Compare with the timeline date string directly
    return timelineDay.date === todayStr;
  };

  const today = isToday();
  const dotColor = today ? "bg-primary" : "bg-success";

  return (
    <div className="relative w-full">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-divider">
        <div className="absolute left-1/2 top-2 -translate-x-1/2">
          <span className="relative flex size-5">
            {today && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full size-5 ${dotColor} border-2 border-background shadow-2xl`}
            />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pl-8 mb-6">
        {/* Date Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground">
            {formatDate(timelineDay.date)}
          </h3>
          <p className="text-xs text-foreground-500 mt-0.5">
            {timelineDay.count}{" "}
            {timelineDay.count === 1 ? "activity" : "activities"}
          </p>
        </div>

        {/* Horizontal Scrollable Activities */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {timelineDay.activities.map((activity) => (
              <div key={activity.id} className="flex-shrink-0 w-80 snap-start">
                <ActivityCard
                  activity={activity}
                  isDeleting={deletingMemoryId === activity.id}
                  onDelete={onDeleteMemory}
                />
              </div>
            ))}
          </div>

          {/* Right shadow to indicate more content */}
          {timelineDay.activities.length > 1 && (
            <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          )}

          {/* Scroll indicators */}
          {timelineDay.activities.length > 1 && (
            <div className="flex gap-1 mt-3 justify-center">
              {timelineDay.activities.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-foreground-300"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
