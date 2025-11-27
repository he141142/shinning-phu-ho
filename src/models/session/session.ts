import { TimeSlot } from "../timeslot/timeslot";

export interface Session {
    id: number;
    class_id: number;
    date: string;
    topic: string;
    notes: string;
    time_slot_id: number;
    time_slot?: TimeSlot;
    created_at: string;
    updated_at: string;
}

export interface CreateSessionInput {
    class_id: number;
    date: string;
    topic: string;
    notes?: string;
    time_slot_id: number;
}

export interface UpdateSessionInput {
    id: number;
    class_id?: number;
    date?: string;
    topic?: string;
    notes?: string;
    time_slot_id?: number;
}
