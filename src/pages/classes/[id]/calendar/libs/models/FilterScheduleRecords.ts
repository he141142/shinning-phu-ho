import { UseFetch } from "@/components/hooks/fetch-data";
import { format } from "date-fns";

export interface FilterScheduleRecord {
    id: number;
    start_time: string;
    end_time: string;
    date: string;
    title: string;
    day_of_week: number;
}

export interface FilterScheduleRecordsInput {
  class_id: number;
  start_date: Date;
  end_date: Date;
}


export interface FilterScheduleRecordsResponse {
    FilterScheduleRecords: FilterScheduleRecord[];
}


export const GetFetchQuery = (input: FilterScheduleRecordsInput): string => {
    const endDate = format(input.end_date, "yyyy-MM-dd");
    const startDate = format(input.start_date, "yyyy-MM-dd");

    return `
        query {
            FilterScheduleRecords(input:{
                class_id: ${input.class_id},
                start_date:"${startDate}",
                end_date:"${endDate}",
                
            }){
                id
                start_time
                end_time,
                date,
                title,
                day_of_week
                }
            }`
}

