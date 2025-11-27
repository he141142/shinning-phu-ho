import { useGraphQLQuery } from "@/lib/graphql";
import { gql } from "graphql-request";

const query = gql`
  query GetClassSemesters($class_id: Int!) {
    GetClassSemesters(class_id: $class_id) {
      semester_id
      semester_name
      start_date
      end_date
      status
    }
  }
`;

export interface ClassSemester {
  semester_id: number;
  semester_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

/**
 * Hook to fetch detailed information for a single class
 * Note: Grade data is mocked at class level until backend supports it
 *
 * @example
 * const { data, isLoading, error } = useGetClassById(456);
 */
export function useGetClassSemesters(classId: number | undefined) {
  const isValidClassId = !!classId && !isNaN(classId) && classId > 0;

  return useGraphQLQuery<{ GetClassSemesters: ClassSemester[] }>(
    ["class-semesters", classId],
    query,
    { class_id: classId || 0 },
    {
      enabled: isValidClassId,
      staleTime: 5 * 60 * 1000,
    }
  );
}
