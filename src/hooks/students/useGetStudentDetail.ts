import { useGraphQLQuery, gql } from '@/lib/graphql';
import type { GetStudentDetail } from '@/models/students/GetStudentDetail/GetStudentDetail';

const GET_STUDENT_DETAIL_QUERY = gql`
  query GetStudentDetail($id: Int!) {
    GetStudentDetail(id: $id) {
      id
      first_name
      last_name
      dob
      email
      address
      phone
      emergency_contact_name
      emergency_contact_phone
      gender
      classes {
        class_id
        class_name
      }
      center {
        center_id
        center_name
      }
      grade {
        grade_id
        grade_name
      }
    }
  }
`;

/**
 * Hook to fetch detailed information for a single student
 *
 * @example
 * const { data, isLoading, error } = useGetStudentDetail(123);
 */
export function useGetStudentDetail(studentId: number) {
  return useGraphQLQuery<{ GetStudentDetail: GetStudentDetail }>(
    ['student', studentId],
    GET_STUDENT_DETAIL_QUERY,
    { id: studentId },
    {
      enabled: !!studentId && studentId > 0,
      // Student details don't change often
      staleTime: 5 * 60 * 1000,
    }
  );
}
