"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import { getEventsForDay } from "@/lib/calendar-utils";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const dayEvents = getEventsForDay(events, currentDate);
  const allDayEvents = dayEvents.filter((event) => event.allDay);
  const timedEvents = dayEvents.filter((event) => !event.allDay);

  return (
    <div className="bg-card rounded-2xl border shadow-apple overflow-hidden">
      {/* All-day events section */}
      {allDayEvents.length > 0 && (
        <div className="p-4 border-b bg-muted/30">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            All Day
          </div>
          <div className="space-y-2">
            {allDayEvents.map((event) => (
              <div
                key={event.id}
                className="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-apple"
                style={{
                  backgroundColor: `${event.color}20`,
                  color: event.color,
                  borderLeft: `4px solid ${event.color}`,
                }}
                onClick={() => onEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                {event.location && (
                  <div className="text-sm opacity-80">{event.location}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map((hour) => {
          const hourEvents = timedEvents.filter((event) => {
            const eventHour = event.startDate.getHours();
            return eventHour === hour;
          });

          return (
            <div
              key={hour}
              className="flex border-b border-border/50 min-h-[80px]"
            >
              <div className="w-20 p-2 text-xs text-muted-foreground text-right border-r bg-muted/30 flex-shrink-0">
                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
              </div>
              <div className="flex-1 p-2 relative">
                {hourEvents.map((event, index) => {
                  const startMinutes = event.startDate.getMinutes();
                  const duration = Math.max(
                    30,
                    (event.endDate.getTime() - event.startDate.getTime()) /
                      (1000 * 60)
                  );
                  const height = Math.min(duration * 1.3, 200);

                  return (
                    <div
                      key={event.id}
                      className="absolute left-2 right-2 p-2 rounded-lg cursor-pointer hover:opacity-80 transition-apple"
                      style={{
                        top: `${(startMinutes / 60) * 80}px`,
                        height: `${height}px`,
                        backgroundColor: event.color,
                        color: "white",
                        zIndex: index + 1,
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="font-medium text-sm truncate">
                        {event.title}
                      </div>
                      <div className="text-xs opacity-90">
                        {format(event.startDate, "h:mm a")} -{" "}
                        {format(event.endDate, "h:mm a")}
                      </div>
                      {event.location && (
                        <div className="text-xs opacity-80 truncate mt-1">
                          {event.location}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
