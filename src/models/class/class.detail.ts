import { Semester } from "../semesters/entity";
import { ClassConfig } from "./class.config";
import { RoomEntity } from "./room.entity";

export interface GradeEntity {
  grade_id: number;
  grade_name: string;
}

export interface StudentEntity {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  email: string | null;
  phone: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  avatar: string | "";
  grade?: GradeEntity; // Grade information for the student
}
export interface TeacherEntity {
  teacher_id: number; // Unique identifier for the teacher
  first_name: string; // First name of the teacher
  last_name: string; // Last name of the teacher
  middle_name?: string; // Middle name of the teacher (optional)
  dob: string; // Date of birth of the teacher (ISO format)
  gender: string; // Gender of the teacher
  phone_number?: string; // Phone number of the teacher (optional)
  email?: string; // Email address of the teacher (optional)
  specialization?: string; // Specialization of the teacher (optional)
  hire_date: string; // Date the teacher was hired (ISO format)
  profile_picture?: string; // URL or path to the profile picture (optional)
}

export interface GetClassById{
  GetClassById: GetClassByIdResponse
}

export interface GetClassByIdResponse {
  class_id: number;
  class_name: string;
  description: string | null;
  students: StudentEntity[] | [];
  class_config: ClassConfig[] | [];
  max_students: number;
  current_enrollment: number;
  room: RoomEntity | null;
  teacher: TeacherEntity | null;
  // Note: grade and grade_id are MOCKED fields, not returned by the GraphQL API
  // They will be replaced when backend adds grade support at the class level
  grade?: string | null; // MOCKED: Mock grade name injected by frontend
  grade_id?: number | null; // MOCKED: Mock grade ID injected by frontend
  current_semester: string | null;
  start_date: string | null;
  end_date?: string | null;
  semester?: Semester;
  room_id?: number | null;
}


export interface StudentTabListModel {
  all: StudentEntity[];
  in_active: StudentEntity[];
  active: StudentEntity[];
}

export interface TimeTable {
  day: string;
  start_time: string;
  end_time: string;
  room: string;
}