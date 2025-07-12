"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import { eventColors } from "@/lib/calendar-utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent;
  selectedDate?: Date;
  onSave: (event: Omit<CalendarEvent, "id"> | CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function EventModal({
  open,
  onOpenChange,
  event,
  selectedDate,
  onSave,
  onDelete,
}: EventModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    allDay: false,
    color: eventColors[0].value,
    location: "",
  });

  const isEditing = !!event;

  React.useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        startDate: format(event.startDate, "yyyy-MM-dd"),
        startTime: event.allDay ? "" : format(event.startDate, "HH:mm"),
        endDate: format(event.endDate, "yyyy-MM-dd"),
        endTime: event.allDay ? "" : format(event.endDate, "HH:mm"),
        allDay: event.allDay,
        color: event.color,
        location: event.location || "",
      });
    } else if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setFormData({
        title: "",
        description: "",
        startDate: dateStr,
        startTime: "09:00",
        endDate: dateStr,
        endTime: "10:00",
        allDay: false,
        color: eventColors[0].value,
        location: "",
      });
    }
  }, [event, selectedDate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const startDateTime = formData.allDay
      ? new Date(formData.startDate)
      : new Date(`${formData.startDate}T${formData.startTime}`);

    const endDateTime = formData.allDay
      ? new Date(formData.endDate)
      : new Date(`${formData.endDate}T${formData.endTime}`);

    const eventData = {
      ...(event && { id: event.id }),
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDate: startDateTime,
      endDate: endDateTime,
      allDay: formData.allDay,
      color: formData.color,
      location: formData.location.trim(),
      attendees: [],
    } as CalendarEvent;

    onSave(eventData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onOpenChange(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>
              {isEditing ? "Edit Event" : "Create New Event"}
            </ModalTitle>
            <ModalCloseButton onClick={() => onOpenChange(false)} />
          </ModalHeader>

          <ModalBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Event description (optional)"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Event location (optional)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allDay"
                checked={formData.allDay}
                onChange={(e) =>
                  setFormData({ ...formData, allDay: e.target.checked })
                }
                className="rounded border-input"
              />
              <label htmlFor="allDay" className="text-sm font-medium">
                All day
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {!formData.allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex space-x-2">
                {eventColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-apple",
                      formData.color === color.value
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                  />
                ))}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"} Event
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
