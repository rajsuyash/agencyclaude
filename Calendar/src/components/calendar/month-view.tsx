"use client";

import { format, isSameDay, isToday, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import { getMonthDays, getEventsForDay } from "@/lib/calendar-utils";

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthView({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onEventClick,
}: MonthViewProps) {
  const monthDays = getMonthDays(currentDate);

  return (
    <div className="bg-card rounded-2xl border shadow-apple overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-medium text-muted-foreground bg-muted/50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {monthDays.map((dayInfo, index) => {
          const dayEvents = getEventsForDay(events, dayInfo.date);
          const isSelected = isSameDay(dayInfo.date, selectedDate);
          const isTodayDate = isToday(dayInfo.date);
          const isOtherMonth = !isSameMonth(dayInfo.date, currentDate);

          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] p-2 border-r border-b cursor-pointer transition-apple hover:bg-accent/50",
                isOtherMonth && "bg-muted/30",
                isSelected && "bg-primary/10"
              )}
              onClick={() => onDateSelect(dayInfo.date)}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isTodayDate &&
                      "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center",
                    isOtherMonth && "text-muted-foreground"
                  )}
                >
                  {format(dayInfo.date, "d")}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded bg-primary/20 text-primary truncate cursor-pointer hover:bg-primary/30 transition-apple"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    style={{
                      backgroundColor: `${event.color}20`,
                      color: event.color,
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
