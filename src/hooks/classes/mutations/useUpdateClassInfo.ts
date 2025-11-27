import { useGraphQLMutationWithUnwrap } from "@/lib/graphql";
import { queryClient } from "@/lib/react-query";
import { gql } from "graphql-request";
import { WeekNumberLabel } from "react-day-picker";

const query = gql`
  mutation EditClassInfo($input: EditClassInfoInput!) {
    EditClassInfo(input: $input) {
      entity_id
      status
      message
    }
  }
`;

export interface EditClassInfoInput {
  class_id: number;
  class_name: string;
  teacher_id: number;
  current_semester_id: number;
  grade_id: number;
}

export interface EditClassInfoResponse {
  EditClassInfo: {
    entity_id: number;
    status: string;
    message: string;
  };
}

export function useEditClassInfo(options?: {
  onSuccess?: (data: EditClassInfoResponse["EditClassInfo"]) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    EditClassInfoResponse["EditClassInfo"],
    { input: EditClassInfoInput }
  >("JoinStudentToClass", query, {
    onSuccess: (data) => {
      // Invalidate classes list to refetch
      queryClient.invalidateQueries({
        queryKey: ["student.enrolment", data.entity_id],
      });
      // Invalidate specific class detail
      queryClient.invalidateQueries({
        queryKey: ["class.student.enrolment", data.entity_id],
      });

      // Call custom onSuccess handler
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
