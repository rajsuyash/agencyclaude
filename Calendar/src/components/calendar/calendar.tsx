"use client";

import { useState } from "react";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import { EventModal } from "./event-modal";
import { useCalendar } from "@/hooks/use-calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Calendar() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    currentView,
    selectedDate,
    events,
    selectedEvent,
    isCreatingEvent,
    isEditingEvent,
    navigation,
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
  } = useCalendar();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const renderCalendarView = () => {
    switch (currentView.type) {
      case "month":
        return (
          <MonthView
            currentDate={currentView.date}
            selectedDate={selectedDate}
            events={events}
            onDateSelect={selectDate}
            onEventClick={editEvent}
          />
        );
      case "week":
        return (
          <WeekView
            currentDate={currentView.date}
            selectedDate={selectedDate}
            events={events}
            onDateSelect={selectDate}
            onEventClick={editEvent}
          />
        );
      case "day":
        return (
          <DayView
            currentDate={currentView.date}
            events={events}
            onEventClick={editEvent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <SidebarContent
              events={events}
              currentView={currentView}
              navigateToday={navigateToday}
              changeView={changeView}
              editEvent={editEvent}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeMobileSidebar}
              />
              <div className="absolute left-0 top-0 h-full w-80 max-w-[80vw] bg-background border-r shadow-apple-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeMobileSidebar}
                      className="h-8 w-8 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <SidebarContent
                    events={events}
                    currentView={currentView}
                    navigateToday={navigateToday}
                    changeView={changeView}
                    editEvent={editEvent}
                    onItemClick={closeMobileSidebar}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Calendar Area */}
          <div className="lg:col-span-4">
            <CalendarHeader
              currentDate={currentView.date}
              onPrevious={navigatePrevious}
              onNext={navigateNext}
              onToday={navigateToday}
              onCreateEvent={createEvent}
              view={currentView.type}
              onViewChange={changeView}
              title={navigation.title}
              onMobileMenuToggle={toggleMobileSidebar}
            />
            {renderCalendarView()}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        open={isCreatingEvent || isEditingEvent}
        onOpenChange={closeEventModal}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={saveEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}

interface SidebarContentProps {
  events: any[];
  currentView: any;
  navigateToday: () => void;
  changeView: (view: "month" | "week" | "day") => void;
  editEvent: (event: any) => void;
  onItemClick?: () => void;
}

function SidebarContent({
  events,
  currentView,
  navigateToday,
  changeView,
  editEvent,
  onItemClick,
}: SidebarContentProps) {
  return (
    <div className="space-y-4">
      {/* Today's Date Card */}
      <Card className="text-center">
        <div className="text-sm text-muted-foreground mb-2">
          {format(new Date(), "EEEE")}
        </div>
        <div className="text-4xl font-light text-primary mb-1">
          {format(new Date(), "d")}
        </div>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "MMMM yyyy")}
        </div>
      </Card>

      {/* Quick Navigation */}
      <Card size="sm">
        <h3 className="text-sm font-medium mb-3">Quick Navigation</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              navigateToday();
              onItemClick?.();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-apple ${
              isToday(currentView.date)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              changeView("month");
              onItemClick?.();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-apple ${
              currentView.type === "month"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            Month View
          </button>
          <button
            onClick={() => {
              changeView("week");
              onItemClick?.();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-apple ${
              currentView.type === "week"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => {
              changeView("day");
              onItemClick?.();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-apple ${
              currentView.type === "day"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            Day View
          </button>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card size="sm">
        <h3 className="text-sm font-medium mb-3">Upcoming Events</h3>
        <div className="space-y-2">
          {events
            .filter((event) => event.startDate >= new Date())
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
            .slice(0, 3)
            .map((event) => (
              <div
                key={event.id}
                className="text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-apple"
                style={{
                  backgroundColor: `${event.color}20`,
                  color: event.color,
                }}
                onClick={() => {
                  editEvent(event);
                  onItemClick?.();
                }}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="opacity-80">
                  {format(event.startDate, "MMM d, h:mm a")}
                </div>
              </div>
            ))}
          {events.filter((event) => event.startDate >= new Date()).length ===
            0 && (
            <div className="text-xs text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
