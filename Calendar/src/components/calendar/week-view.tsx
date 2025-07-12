"use client";

import { format, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import { getWeekDays, getEventsForDay } from "@/lib/calendar-utils";

interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onEventClick,
}: WeekViewProps) {
  const weekDaysData = getWeekDays(currentDate);

  return (
    <div className="bg-card rounded-2xl border shadow-apple overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-8 border-b bg-muted/50">
        <div className="p-4 border-r"></div>
        {weekDaysData.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={cn(
                "p-4 text-center cursor-pointer transition-apple hover:bg-accent/50",
                isSelected && "bg-primary/10",
                index < 6 && "border-r"
              )}
              onClick={() => onDateSelect(date)}
            >
              <div className="text-xs text-muted-foreground mb-1">
                {weekDays[index]}
              </div>
              <div
                className={cn(
                  "text-lg font-medium",
                  isTodayDate &&
                    "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                )}
              >
                {format(date, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-border/50"
          >
            <div className="p-2 text-xs text-muted-foreground text-right border-r bg-muted/30">
              {format(new Date().setHours(hour, 0, 0, 0), "h a")}
            </div>
            {weekDaysData.map((date, dayIndex) => {
              const dayEvents = getEventsForDay(events, date).filter(
                (event) => {
                  if (event.allDay) return false;
                  const eventHour = event.startDate.getHours();
                  return eventHour === hour;
                }
              );

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    "min-h-[60px] p-1 cursor-pointer transition-apple hover:bg-accent/30",
                    dayIndex < 6 && "border-r border-border/50"
                  )}
                  onClick={() => onDateSelect(date)}
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 transition-apple"
                      style={{
                        backgroundColor: event.color,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="opacity-90">
                        {format(event.startDate, "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
