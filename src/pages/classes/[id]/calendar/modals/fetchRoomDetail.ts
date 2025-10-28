import { UseFetch } from "@/components/hooks/fetch-data";
import { RoomEntity } from "./fetchScheduleDetail";
import { HOST } from "@/static/env";

const getQueryRooms = () => {
  return `
    query{
        ListRoomsByCenter(center_id:1,per_page:100,page:1){
            total
            data{
            room_id
            room_number
            capacity
            center{
                center_id
                center_name
                address
                phone_number
                email
                is_active
                website
            }
            }
        }
        }
`;
};

export interface PaginationModel<T> {
  total: number;
  data: T[];
}

export interface ListRoomsByCenterResponse {
  ListRoomsByCenter: PaginationModel<RoomEntity>;
}

export const UseFetchGetRooms = () => {
  const { data, error, loading } = UseFetch<ListRoomsByCenterResponse>(
    `${HOST}/query`,
    getQueryRooms()
  );

  return {
    rooms: data?.ListRoomsByCenter.data,
    error,
    loading,
  };
};
