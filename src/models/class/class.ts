import { Semester } from "../semesters/entity";

type ClassInfo = {
  Id: number;
  Name: string;
  Description: string;
  Teacher: string;
  Status: string;
  Enrolled: number;
};

type GradeInfo = {
  Id: number;
  Name: string;
  Description?: string;
  Teacher?: string;
  Status?: string;
  Enrolled?: number;
};

export type { ClassInfo, GradeInfo };

export interface GraphQLResponse<T> {
  data: T;
}

// Type for the "GetListClass" response
export interface GetListClassResponse {
  GetListClass: {
    total: number;
    data: Class[];
  };
}

// Type for the "Class" object
export interface Class {
  class_id: number;
  class_name: string;
  description: string;
  teacher_id: number | null;
  start_date: string | null; // Use string for date serialization
  end_date: string | null;
  max_students: number;
  current_enrollment: number;
  room_id: number | null;
  schedule: string;
  students: Student[];
  semster?: Semester;
}

// Type for a "Student" object (extend as needed)
export interface Student {
  student_id?: number;
  student_name?: string;
}

// Example usage: Generic function for handling different endpoints
type ExampleGraphQLResponse =
  | GraphQLResponse<GetListClassResponse>
  | GraphQLResponse<OtherEndpointResponse>; // Extend this union with other responses

// Placeholder for other endpoint response types
export interface OtherEndpointResponse {
  // Define structure for other responses here
}

export interface TimeTable {
  day: string;
  time: string;
  room: string;
}

export interface StudentDetail {
  id: number;
  name: string;
  avatar: string;
}

export interface Teacher {
  name: string;
  avatar: string;
}

export interface ClassDetailPageData {
  name: string;
  id: number;
  description: string;
  totalEnrollment: number;
  grade: string;
  teacher: Teacher;
  startDate: string;
  currentSemester: string;
}
