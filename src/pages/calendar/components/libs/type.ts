export interface Room {
    id: string
    name: string
    description: string
    capacity: number
    features: string[]
    location: string
    availableFrom: string
    availableTo: string
    availabilityNotes: string
    
  }
  
  export type EventType = {
    id: string
    name: string
  }
  
  export interface Event {
    id: string
    title: string
    description: string
    startTime: string
    endTime: string
    room: Room
    type: "meeting" | "class" | "workshop" | "other"
  }
  