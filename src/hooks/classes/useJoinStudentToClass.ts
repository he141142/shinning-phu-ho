import { useGraphQLMutationWithUnwrap } from "@/lib/graphql";
import { queryClient } from "@/lib/react-query";
import { gql } from "graphql-request";

const mutationQuery = gql`
  mutation JoinStudentToClass($input: JoinStudentToClassInput!) {
    JoinStudentToClass(input: $input) {
      entity_id
      status
      message
    }
  }
`;

export interface JoinStudentToClassInput {
  student_id: number;
  class_id: number;
  semester_id: number;
}

export interface JounStudentToClassResponse {
  JoinStudentToClass: {
    entity_id: number;
    status: string;
    message: string;
  };
}

export function useJoinStudentToClass(options?: {
  onSuccess?: (data: JounStudentToClassResponse["JoinStudentToClass"]) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    JounStudentToClassResponse["JoinStudentToClass"],
    { input: JoinStudentToClassInput }
  >("JoinStudentToClass", mutationQuery, {
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
