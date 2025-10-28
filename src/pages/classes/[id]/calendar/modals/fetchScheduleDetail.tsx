import { UseFetch } from "@/components/hooks/fetch-data";
import { Center } from "@/models/students/GetStudentDetail/GetStudentDetail";
import { HOST } from "@/static/env";

export interface GetScheduleDetail {
    id: number;
    start_time: string;
    end_time: string;
    title: string;
    date: string;
    day_of_week: number;
    room?: RoomEntity;
}

export interface GetScheduleDetailResponse {
    GetScheduleDetail: GetScheduleDetail;
}

export interface RoomEntity {
    room_id: number;
    room_number: string;
    capacity: number;
    center_id: number;
    center: Center;
    features: string[];
    available_from: string;
    available_to: string;
    availability_note: string;
}


export const UseFetchScheduleDetail = (id: number) => {
    const { data, error, loading } = UseFetch<GetScheduleDetailResponse>(`${HOST}/query`, `
        query{
            GetScheduleDetail(schedule_id: ${id}){
                id
                start_time
                end_time
                title
                date
                day_of_week
                room{
                room_id
                room_number
                capacity
                center_id
                center{
                    center_id
                    center_name
                    address
                    phone_number
                }
                room_number
                capacity
                features
                available_from
                available_to
                availability_note
                }
            }
            }
        `);

    return {
        schedule: data,
        error,
        loading
    }
}