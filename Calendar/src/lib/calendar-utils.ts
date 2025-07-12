import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";
import { CalendarEvent, DayInfo, WeekInfo } from "@/types/calendar";

export function getMonthDays(date: Date): DayInfo[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  }).map((day) => ({
    date: day,
    isToday: isToday(day),
    isSelected: false,
    isOtherMonth: !isSameMonth(day, date),
    events: [],
  }));
}

export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function getEventsForDay(
  events: CalendarEvent[],
  date: Date
): CalendarEvent[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return events.filter((event) => {
    if (event.allDay) {
      return isSameDay(event.startDate, date);
    }
    return (
      isWithinInterval(event.startDate, { start: dayStart, end: dayEnd }) ||
      isWithinInterval(event.endDate, { start: dayStart, end: dayEnd }) ||
      (event.startDate <= dayStart && event.endDate >= dayEnd)
    );
  });
}

export function getEventsForWeek(
  events: CalendarEvent[],
  weekStart: Date
): WeekInfo {
  const week = getWeekDays(weekStart);
  const weekEnd = addDays(weekStart, 6);

  const weekEvents = events.filter((event) => {
    return (
      isWithinInterval(event.startDate, { start: weekStart, end: weekEnd }) ||
      isWithinInterval(event.endDate, { start: weekStart, end: weekEnd }) ||
      (event.startDate <= weekStart && event.endDate >= weekEnd)
    );
  });

  return {
    week,
    events: weekEvents,
  };
}

export function formatEventTime(event: CalendarEvent): string {
  if (event.allDay) {
    return "All day";
  }

  const start = format(event.startDate, "h:mm a");
  const end = format(event.endDate, "h:mm a");

  if (isSameDay(event.startDate, event.endDate)) {
    return `${start} - ${end}`;
  }

  return `${start} - ${format(event.endDate, "MMM d, h:mm a")}`;
}

export function getEventDuration(event: CalendarEvent): number {
  return event.endDate.getTime() - event.startDate.getTime();
}

export function getCalendarNavigation(
  currentDate: Date,
  view: "month" | "week" | "day"
) {
  switch (view) {
    case "month":
      return {
        previous: subMonths(currentDate, 1),
        next: addMonths(currentDate, 1),
        title: format(currentDate, "MMMM yyyy"),
      };
    case "week":
      return {
        previous: subWeeks(currentDate, 1),
        next: addWeeks(currentDate, 1),
        title: `${format(startOfWeek(currentDate), "MMM d")} - ${format(
          endOfWeek(currentDate),
          "MMM d, yyyy"
        )}`,
      };
    case "day":
      return {
        previous: subDays(currentDate, 1),
        next: addDays(currentDate, 1),
        title: format(currentDate, "EEEE, MMMM d, yyyy"),
      };
    default:
      throw new Error(`Invalid view: ${view}`);
  }
}

export const eventColors = [
  { name: "Blue", value: "rgb(59, 130, 246)", bg: "bg-blue-500" },
  { name: "Red", value: "rgb(239, 68, 68)", bg: "bg-red-500" },
  { name: "Green", value: "rgb(34, 197, 94)", bg: "bg-green-500" },
  { name: "Yellow", value: "rgb(245, 158, 11)", bg: "bg-yellow-500" },
  { name: "Purple", value: "rgb(168, 85, 247)", bg: "bg-purple-500" },
  { name: "Pink", value: "rgb(236, 72, 153)", bg: "bg-pink-500" },
  { name: "Indigo", value: "rgb(99, 102, 241)", bg: "bg-indigo-500" },
  { name: "Orange", value: "rgb(249, 115, 22)", bg: "bg-orange-500" },
];
