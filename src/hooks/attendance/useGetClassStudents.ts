import { useGraphQLQuery, gql } from '@/lib/graphql';
import type { StudentEnrollment } from '@/models/attendance/Attendance';

const GET_CLASS_STUDENTS_QUERY = gql`
  query GetClassStudents($class_id: Int!) {
    GetClassStudents(class_id: $class_id) {
      student_id
      class_id
      student_first_name
      student_last_name
      enrollment_date
    }
  }
`;

export interface GetClassStudentsResponse {
  GetClassStudents: StudentEnrollment[];
}

/**
 * Hook to get enrolled students for a class
 */
export function useGetClassStudents(classId: number) {
  const { data, error, isLoading, refetch } = useGraphQLQuery<
    GetClassStudentsResponse,
    { class_id: number }
  >(
    ['class-students', classId],
    GET_CLASS_STUDENTS_QUERY,
    { class_id: classId },
    {
      enabled: !!classId && classId > 0,
    }
  );

  return {
    students: data?.GetClassStudents ?? [],
    error,
    isLoading,
    refetch,
  };
}
