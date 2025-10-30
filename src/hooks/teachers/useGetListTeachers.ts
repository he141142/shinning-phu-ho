import { useGraphQLQueryWithVariables, gql } from '@/lib/graphql';
import type { ListTeachers } from '@/models/teachers/ListTeachers';

const LIST_TEACHERS_QUERY = gql`
  query ListTeachers($input: ListTeachersInput!) {
    ListTeachers(input: $input) {
      total
      data {
        teacher_id
        first_name
        last_name
        email
        address
        classes {
          class_id
          class_name
          current_enrollment
        }
        center {
          center_id
          center_name
        }
        user_account {
          user_id
          username
        }
        total_students
      }
    }
  }
`;

export interface UseGetListTeachersVariables {
  page: number;
  limit: number;
  order_by?: string;
  where?: Record<string, any>;
}

/**
 * Hook to fetch paginated list of teachers
 *
 * @example
 * const { data, isLoading, error, refetch } = useGetListTeachers({
 *   page: 1,
 *   limit: 10,
 *   order_by: 'name desc'
 * });
 */
export function useGetListTeachers(variables: UseGetListTeachersVariables) {
  const input = {
    page: variables.page,
    limit: variables.limit,
    order_by: variables.order_by || 'name desc',
    where: variables.where || {},
  };

  return useGraphQLQueryWithVariables<ListTeachers>(
    'teachers',
    LIST_TEACHERS_QUERY,
    { input },
    {
      staleTime: 3 * 60 * 1000,
      enabled: variables.page > 0 && variables.limit > 0,
    }
  );
}
