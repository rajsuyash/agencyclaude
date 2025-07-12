export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  color: string;
  location?: string;
  attendees?: string[];
  reminder?: number; // minutes before event
  recurring?: {
    type: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: Date;
  };
}

export interface CalendarView {
  type: "month" | "week" | "day";
  date: Date;
}

export interface CalendarState {
  currentView: CalendarView;
  selectedDate: Date;
  events: CalendarEvent[];
  selectedEvent?: CalendarEvent;
  isCreatingEvent: boolean;
  isEditingEvent: boolean;
}

export interface DayInfo {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isOtherMonth: boolean;
  events: CalendarEvent[];
}

export interface WeekInfo {
  week: Date[];
  events: CalendarEvent[];
}
