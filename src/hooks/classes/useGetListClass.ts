import { useGraphQLQueryWithVariables, gql } from '@/lib/graphql';
import type { GetListClassResponse, GetListClassInput } from '@/models/class/class';

const GET_LIST_CLASS_QUERY = gql`
  query GetListClass($input: GetListClassInput!) {
    GetListClass(input: $input) {
      total
      data {
        class_id
        class_name
        description
        start_date
        end_date
        status
        room {
          room_id
          room_name
          capacity
        }
        semester {
          semester_id
          semester_name
          start_date
          end_date
        }
      }
    }
  }
`;

export interface UseGetListClassVariables {
  page: number;
  limit: number;
  order_by?: string;
  where?: Record<string, any>;
}

/**
 * Hook to fetch paginated list of classes
 *
 * @example
 * const { data, isLoading, error, refetch } = useGetListClass({
 *   page: 1,
 *   limit: 10,
 *   where: { not_having_teacher: true }
 * });
 */
export function useGetListClass(variables: UseGetListClassVariables) {
  const input: GetListClassInput = {
    page: variables.page,
    limit: variables.limit,
    order_by: variables.order_by || 'class_id desc',
    where: variables.where || {},
  };

  return useGraphQLQueryWithVariables<GetListClassResponse>(
    'classes',
    GET_LIST_CLASS_QUERY,
    { input },
    {
      staleTime: 3 * 60 * 1000,
      enabled: variables.page > 0 && variables.limit > 0,
    }
  );
}
