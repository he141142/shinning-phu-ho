import { useGraphQLQuery, gql } from '@/lib/graphql';
import type { Grade } from '@/models/grades/ListAllGrades';

const LIST_ALL_GRADES_QUERY = gql`
  query ListAllGrades {
    ListAllGrades {
      grade_id
      grade_name
    }
  }
`;

/**
 * Hook to fetch all available grades
 *
 * @example
 * const { data, isLoading, error } = useGetAllGrades();
 */
export function useGetAllGrades() {
  return useGraphQLQuery<{ ListAllGrades: Grade[] }>(
    ['grades'],
    LIST_ALL_GRADES_QUERY,
    undefined,
    {
      // Grades rarely change, keep them cached for a long time
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
}
