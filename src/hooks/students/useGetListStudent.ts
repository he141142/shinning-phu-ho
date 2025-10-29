import { useGraphQLQueryWithVariables, gql } from '@/lib/graphql';
import type { GetListStudentResponse, GetListStudentInput } from '@/models/students/GetListStudent/GetListStudent';

const GET_LIST_STUDENT_QUERY = gql`
  query GetListStudent($input: GetListStudentInput!) {
    GetListStudent(input: $input) {
      total
      data {
        id
        first_name
        last_name
        dob
        email
        address
        phone
        classes {
          class_id
          class_name
        }
        subject {
          id
          name
        }
        grade {
          grade_id
          grade_name
        }
      }
    }
  }
`;

export interface UseGetListStudentVariables {
  page: number;
  limit: number;
  order_by?: string;
  where?: Record<string, any>;
}

/**
 * Hook to fetch paginated list of students
 *
 * @example
 * const { data, isLoading, error, refetch } = useGetListStudent({
 *   page: 1,
 *   limit: 10,
 *   order_by: 'first_name asc',
 *   where: { grade_id: 1 }
 * });
 */
export function useGetListStudent(variables: UseGetListStudentVariables) {
  const input: GetListStudentInput = {
    page: variables.page,
    limit: variables.limit,
    order_by: variables.order_by || 'id desc',
    where: variables.where || {},
  };

  return useGraphQLQueryWithVariables<GetListStudentResponse>(
    'students',
    GET_LIST_STUDENT_QUERY,
    { input },
    {
      // Keep data fresh for 3 minutes
      staleTime: 3 * 60 * 1000,
      // Enable this query only if we have valid page/limit
      enabled: variables.page > 0 && variables.limit > 0,
    }
  );
}
