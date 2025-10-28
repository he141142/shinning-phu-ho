"use client";

import { create } from "zustand";
import type { Event, Room, EventType } from  "@/pages/calendar/components/libs/type";

interface CalendarState {
  events: Event[];
  rooms: Room[];
  eventTypes: EventType[];
  filteredRooms: string[];
  filteredEventTypes: string[];

  setInitialData: (data: {
    events: Event[];
    rooms: Room[];
    eventTypes: EventType[];
  }) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  toggleRoomFilter: (roomId: string) => void;
  toggleEventTypeFilter: (typeId: string) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  rooms: [],
  eventTypes: [],
  filteredRooms: [],
  filteredEventTypes: [],

  setInitialData: (data) =>
    set(() => ({
      events: data.events,
      rooms: data.rooms,
      eventTypes: data.eventTypes,
      filteredRooms: data.rooms.map((room) => room.id),
      filteredEventTypes: data.eventTypes.map((type) => type.id),
    })),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      ),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),

  toggleRoomFilter: (roomId) =>
    set((state) => {
      if (state.filteredRooms.includes(roomId)) {
        return {
          filteredRooms: state.filteredRooms.filter((id) => id !== roomId),
        };
      } else {
        return {
          filteredRooms: [...state.filteredRooms, roomId],
        };
      }
    }),

  toggleEventTypeFilter: (typeId) =>
    set((state) => {
      if (state.filteredEventTypes.includes(typeId)) {
        return {
          filteredEventTypes: state.filteredEventTypes.filter((id) => id !== typeId),
        };
      } else {
        return {
          filteredEventTypes: [...state.filteredEventTypes, typeId],
        };
      }
    }),
}));