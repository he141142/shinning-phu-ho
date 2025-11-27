export interface TimeSlot {
    id: number;
    slot_name: string;
    start_time: string;
    end_time: string;
    duration_mins: number;
    created_at: string;
    updated_at: string;
}

export interface CreateTimeSlotInput {
    slot_name: string;
    start_time: string;
    end_time: string;
}

export interface UpdateTimeSlotInput {
    id: number;
    slot_name?: string;
    start_time?: string;
    end_time?: string;
}
