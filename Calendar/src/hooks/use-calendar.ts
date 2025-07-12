"use client";

import { useState, useCallback } from "react";
import { CalendarEvent, CalendarView } from "@/types/calendar";
import { getCalendarNavigation } from "@/lib/calendar-utils";

// Sample events for demonstration
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync",
    startDate: new Date(2024, 11, 15, 10, 0),
    endDate: new Date(2024, 11, 15, 11, 0),
    allDay: false,
    color: "rgb(59, 130, 246)",
    location: "Conference Room A",
    attendees: [],
  },
  {
    id: "2",
    title: "Project Deadline",
    description: "Final submission for Q4 project",
    startDate: new Date(2024, 11, 20, 0, 0),
    endDate: new Date(2024, 11, 20, 23, 59),
    allDay: true,
    color: "rgb(239, 68, 68)",
    attendees: [],
  },
  {
    id: "3",
    title: "Coffee Chat",
    description: "Catch up with Sarah",
    startDate: new Date(2024, 11, 18, 14, 30),
    endDate: new Date(2024, 11, 18, 15, 30),
    allDay: false,
    color: "rgb(34, 197, 94)",
    location: "Local Café",
    attendees: [],
  },
];

export function useCalendar() {
  const [currentView, setCurrentView] = useState<CalendarView>({
    type: "month",
    date: new Date(),
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | undefined
  >();
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  const navigation = getCalendarNavigation(currentView.date, currentView.type);

  const navigatePrevious = useCallback(() => {
    setCurrentView((prev) => ({
      ...prev,
      date: navigation.previous,
    }));
  }, [navigation.previous]);

  const navigateNext = useCallback(() => {
    setCurrentView((prev) => ({
      ...prev,
      date: navigation.next,
    }));
  }, [navigation.next]);

  const navigateToday = useCallback(() => {
    const today = new Date();
    setCurrentView((prev) => ({
      ...prev,
      date: today,
    }));
    setSelectedDate(today);
  }, []);

  const changeView = useCallback((type: "month" | "week" | "day") => {
    setCurrentView((prev) => ({
      ...prev,
      type,
    }));
  }, []);

  const selectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      if (currentView.type !== "day") {
        setCurrentView((prev) => ({
          type: "day",
          date,
        }));
      }
    },
    [currentView.type]
  );

  const createEvent = useCallback(() => {
    setSelectedEvent(undefined);
    setIsCreatingEvent(true);
  }, []);

  const editEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditingEvent(true);
  }, []);

  const saveEvent = useCallback(
    (eventData: Omit<CalendarEvent, "id"> | CalendarEvent) => {
      if ("id" in eventData) {
        // Update existing event
        setEvents((prev) =>
          prev.map((event) => (event.id === eventData.id ? eventData : event))
        );
      } else {
        // Create new event
        const newEvent: CalendarEvent = {
          ...eventData,
          id: Date.now().toString(),
        };
        setEvents((prev) => [...prev, newEvent]);
      }
      setIsCreatingEvent(false);
      setIsEditingEvent(false);
      setSelectedEvent(undefined);
    },
    []
  );

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setIsEditingEvent(false);
    setSelectedEvent(undefined);
  }, []);

  const closeEventModal = useCallback(() => {
    setIsCreatingEvent(false);
    setIsEditingEvent(false);
    setSelectedEvent(undefined);
  }, []);

  return {
    // State
    currentView,
    selectedDate,
    events,
    selectedEvent,
    isCreatingEvent,
    isEditingEvent,
    navigation,

    // Actions
    navigatePrevious,
    navigateNext,
    navigateToday,
    changeView,
    selectDate,
    createEvent,
    editEvent,
    saveEvent,
    deleteEvent,
    closeEventModal,
  };
}
