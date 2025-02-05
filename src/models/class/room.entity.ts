
export interface CenterEntity {
    center_id: number;
}

export interface RoomEntity {
    capacity: number;
    center: CenterEntity;
    room_id: number;
    room_number: string;
}