import { useGraphQLQuery, gql } from '@/lib/graphql';
import type { GetTeacherDetail } from '@/models/teachers/GetTeacherDetail/GetTeacherDetail';

const GET_TEACHER_DETAIL_QUERY = gql`
  query GetTeacherDetail($teacher_id: Int!) {
    GetTeacherDetail(teacher_id: $teacher_id) {
      address
      teacher_id
      first_name
      last_name
      email
      phone_number
      classes {
        class_id
        class_name
        current_enrollment
        semester {
          semester_id
          semester_name
        }
      }
      user_account {
        username
        user_id
      }
      total_students
      center {
        center_id
        center_name
      }
    }
  }
`;

/**
 * Hook to fetch detailed information for a single teacher
 *
 * @example
 * const { data, isLoading, error, refetch } = useGetTeacherDetail(17);
 */
export function useGetTeacherDetail(teacherId: number) {
  return useGraphQLQuery<GetTeacherDetail>(
    ['teacher', teacherId],
    GET_TEACHER_DETAIL_QUERY,
    { teacher_id: teacherId },
    {
      enabled: !!teacherId && teacherId > 0,
      // Teacher details don't change often
      staleTime: 5 * 60 * 1000,
    }
  );
}
