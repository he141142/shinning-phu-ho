import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../internal/client";
import { useFetchStates } from "../internal/use-api";
import { request } from "https";

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  status_code?: number;
}

export interface TimeSlot {
  id: number;
  slot_name: string;
  start_time: string;
  end_time: string;
}

export interface SessionItem {
  id: number;
  date: string;
  topic: string;
  notes: string;
  time_slot_id: number;
  class_semester_id: number;
  time_slot: TimeSlot;
  week_day: any[];
}

export interface GetSessionsByGroupRequest {
  class_ids: number[];
  from: string;
  to: string;
}

export const sessionService = {
  async GetSessionByGroup(
    request: GetSessionsByGroupRequest
  ): Promise<SuccessResponse<SessionItem[] | null>> {
    try {
      let response = await apiClient.request<SuccessResponse<SessionItem[]>>(
        `/api/v1/sessions/group`,
        "token",
        { method: "POST", body: JSON.stringify(request) }
      );
      console.log(response);

      return {
        data: response.data,
        success: true,
        status_code: response.status_code,
      };
    } catch (error) {
      console.log(error);

      return {
        data: null,
        success: false,
      };
    }
  },
  async GetLatestSessionByClass(classID: number): Promise<SessionItem | null> {
    try {
      let response = await apiClient.request<
        SuccessResponse<SessionItem | null>
      >(`/api/v1/sessions/class/${classID}`, "token", { method: "GET" });
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export const UseGetSessionsByGroup = (request: GetSessionsByGroupRequest) => {
  const queryClient = useQueryClient();
  const queryKey = [
    "sessionService.sessions.group",
    request.class_ids,
    request.from,
    request.to,
  ];
  const queryResult = useQuery({
    queryKey,
    queryFn: () => sessionService.GetSessionByGroup(request),
    staleTime: 5 * 60 * 1000, // ✅ Cache fresh for 5 minutes
  });

  return useFetchStates<SuccessResponse<SessionItem[] | null>>({
    data: queryResult?.data,
    error: queryResult.error,
    loading: queryResult.isLoading,
    refetch: queryResult.refetch,
    cancel: () => {
      queryClient.cancelQueries({ queryKey });
      queryClient.removeQueries({ queryKey });
    },
  });
};

export const UseGetLatestSessionByClass = (classID: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["sessionService.sessions.latest", classID];
  const queryResult = useQuery({
    queryKey,
    queryFn: () => sessionService.GetLatestSessionByClass(classID),
    staleTime: 5 * 60 * 1000, // ✅ Cache fresh for 5 minutes,
    enabled: classID > 0,
  });

  return useFetchStates<SessionItem | null>({
    data: queryResult?.data,
    error: queryResult.error,
    loading: queryResult.isLoading,
    refetch: queryResult.refetch,
    cancel: () => {
      queryClient.cancelQueries({ queryKey });
      queryClient.removeQueries({ queryKey });
    },
  });
};
