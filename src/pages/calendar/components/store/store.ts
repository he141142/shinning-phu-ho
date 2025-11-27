import { create } from "zustand"
import type { Event, Room, EventType } from "../libs/type"

interface CalendarState {
  events: Event[]
  rooms: Room[]
  eventTypes: EventType[]
  filteredRooms: string[]
  filteredEventTypes: string[]

  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  toggleRoomFilter: (roomId: string) => void
  toggleEventTypeFilter: (typeId: string) => void
};

// Sample data
const sampleRooms: Room[] = [
  {
    id: "room1",
    name: "Conference Room A",
    description: "Large conference room with video conferencing equipment",
    capacity: 20,
    features: ["wifi", "projector", "videoconference", "microphone"],
    location: "Building 1, Floor 2",
    availableFrom: "8:00 AM",
    availableTo: "6:00 PM",
    availabilityNotes: "Available on weekdays only",
  },
  {
    id: "room2",
    name: "Meeting Room B",
    description: "Medium-sized meeting room for team discussions",
    capacity: 10,
    features: ["wifi", "whiteboard"],
    location: "Building 1, Floor 3",
    availableFrom: "8:00 AM",
    availableTo: "8:00 PM",
    availabilityNotes: "Available 7 days a week",
  },
  {
    id: "room3",
    name: "Classroom C",
    description: "Classroom setup with desks and teaching equipment",
    capacity: 30,
    features: ["wifi", "projector", "whiteboard", "accessibility"],
    location: "Building 2, Floor 1",
    availableFrom: "9:00 AM",
    availableTo: "5:00 PM",
    availabilityNotes: "Priority for educational events",
  },
  {
    id: "room4",
    name: "Workshop Space",
    description: "Open space for workshops and collaborative activities",
    capacity: 25,
    features: ["wifi", "whiteboard", "refreshments"],
    location: "Building 2, Floor 2",
    availableFrom: "8:00 AM",
    availableTo: "7:00 PM",
    availabilityNotes: "Flexible setup available",
  },
]

const sampleEventTypes: EventType[] = [
  { id: "type1", name: "meeting" },
  { id: "type2", name: "class" },
  { id: "type3", name: "workshop" },
  { id: "type4", name: "other" },
]

// Generate some sample events
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

const sampleEvents: Event[] = [
  {
    id: "event1",
    title: "Team Meeting",
    description: "Weekly team sync meeting",
    startTime: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    room: sampleRooms[0],
    type: "meeting",
  },
  {
    id: "event2",
    title: "JavaScript Workshop",
    description: "Introduction to JavaScript for beginners",
    startTime: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
    room: sampleRooms[3],
    type: "workshop",
  },
  {
    id: "event3",
    title: "React Class",
    description: "Advanced React patterns and techniques",
    startTime: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(),
    endTime: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString(),
    room: sampleRooms[2],
    type: "class",
  },
  {
    id: "event4",
    title: "Product Demo",
    description: "Demonstration of new product features",
    startTime: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
    endTime: new Date(tomorrow.setHours(16, 0, 0, 0)).toISOString(),
    room: sampleRooms[1],
    type: "other",
  },
]

export const useCalendarStore = create<CalendarState>((set) => ({
  events: sampleEvents,
  rooms: sampleRooms,
  eventTypes: sampleEventTypes,
  filteredRooms: sampleRooms.map((room) => room.id),
  filteredEventTypes: sampleEventTypes.map((type) => type.id),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)),
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
        }
      } else {
        return {
          filteredRooms: [...state.filteredRooms, roomId],
        }
      }
    }),

  toggleEventTypeFilter: (typeId) =>
    set((state) => {
      if (state.filteredEventTypes.includes(typeId)) {
        return {
          filteredEventTypes: state.filteredEventTypes.filter((id) => id !== typeId),
        }
      } else {
        return {
          filteredEventTypes: [...state.filteredEventTypes, typeId],
        }
      }
    }),
}))

