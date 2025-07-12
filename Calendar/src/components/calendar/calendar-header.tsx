"use client";

import { ChevronLeft, ChevronRight, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreateEvent: () => void;
  view: "month" | "week" | "day";
  onViewChange: (view: "month" | "week" | "day") => void;
  title: string;
  onMobileMenuToggle?: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  onCreateEvent,
  view,
  onViewChange,
  title,
  onMobileMenuToggle,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
      {/* Top row - Title and navigation */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="h-8 w-8 rounded-full hover:bg-accent lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <h1 className="text-2xl sm:text-3xl font-semibold truncate">{title}</h1>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="h-8 w-8 rounded-full hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="h-8 w-8 rounded-full hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom row - Controls */}
      <div className="flex items-center justify-between sm:justify-end space-x-3">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onToday} className="text-sm px-3">
            Today
          </Button>

          {/* View selector - hidden on very small screens */}
          <div className="hidden xs:flex items-center bg-muted rounded-lg p-1">
            {(["month", "week", "day"] as const).map((viewType) => (
              <Button
                key={viewType}
                variant={view === viewType ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(viewType)}
                className={`text-xs sm:text-sm capitalize px-2 sm:px-3 ${
                  view === viewType ? "" : "hover:bg-transparent"
                }`}
              >
                {viewType === "month" ? "M" : viewType === "week" ? "W" : "D"}
                <span className="hidden sm:inline ml-1">
                  {viewType.slice(1)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            onClick={onCreateEvent}
            className="flex items-center space-x-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Event</span>
          </Button>
        </div>
      </div>

      {/* Mobile view selector */}
      <div className="flex xs:hidden items-center bg-muted rounded-lg p-1 w-full">
        {(["month", "week", "day"] as const).map((viewType) => (
          <Button
            key={viewType}
            variant={view === viewType ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(viewType)}
            className={`text-sm capitalize flex-1 ${
              view === viewType ? "" : "hover:bg-transparent"
            }`}
          >
            {viewType}
          </Button>
        ))}
      </div>
    </div>
  );
}
