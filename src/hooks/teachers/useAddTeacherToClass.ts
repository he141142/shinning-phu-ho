import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';
import type { CommonResponse } from '@/models/common';

const ADD_TEACHER_TO_CLASS_MUTATION = gql`
  mutation AddTeacherToClass($class_id: Int!, $teacher_id: Int!) {
    AddTeacherToClass(input: { class_id: $class_id, teacher_id: $teacher_id }) {
      entity_id
      message
      status
    }
  }
`;

export interface AddTeacherToClassVariables {
  class_id: number;
  teacher_id: number;
}

/**
 * Hook to add a teacher to a class
 *
 * @example
 * const { mutate, isPending } = useAddTeacherToClass({
 *   onSuccess: () => {
 *     toast({ title: 'Teacher added to class successfully!' });
 *   }
 * });
 *
 * mutate({ teacher_id: 123, class_id: 456 });
 */
export function useAddTeacherToClass(options?: {
  onSuccess?: (data: CommonResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<CommonResponse, AddTeacherToClassVariables>(
    'AddTeacherToClass',
    ADD_TEACHER_TO_CLASS_MUTATION,
    {
      onSuccess: (data, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['teacher', variables.teacher_id] });
        queryClient.invalidateQueries({ queryKey: ['class', variables.class_id] });
        queryClient.invalidateQueries({ queryKey: ['classes'] });

        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
}
