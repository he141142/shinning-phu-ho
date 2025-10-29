// Attendance Status Types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

// Attendance Model
export interface Attendance {
  attendance_id: number;
  student_id: number;
  class_id: number;
  session_id: number;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  recorded_by?: number;
  created_at?: string;
  updated_at?: string;
}

// Student Enrollment Model
export interface StudentEnrollment {
  student_id: number;
  class_id: number;
  student_first_name: string;
  student_last_name: string;
  enrollment_date?: string;
}

// Attendance Record for UI
export interface AttendanceRecord {
  student_id: number;
  student_name: string;
  status: AttendanceStatus;
  notes?: string;
}

// Class Session Model
export interface ClassSession {
  session_id: number;
  class_id: number;
  class_name: string;
  teacher_id: number;
  teacher_name: string;
  date: string;
  start_time: string;
  end_time: string;
  room_id?: number;
  room_name?: string;
}

// Request/Response Types
export interface MarkAttendanceRequest {
  class_id: number;
  session_id: number;
  date: string;
  records: {
    student_id: number;
    status: AttendanceStatus;
    notes?: string;
  }[];
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  attendance_ids: number[];
}

export interface GetAttendanceRequest {
  class_id?: number;
  session_id?: number;
  student_id?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  status?: AttendanceStatus;
  teacher_id?: number;
}

export interface GetAttendanceResponse {
  attendance: Attendance[];
  total: number;
}

// Attendance Summary
export interface AttendanceSummary {
  total_students: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendance_rate: number;
}

// For Admin Overview
export interface AttendanceOverviewRecord {
  attendance_id: number;
  date: string;
  class_id: number;
  class_name: string;
  student_id: number;
  student_name: string;
  status: AttendanceStatus;
  recorded_by_id?: number;
  recorded_by_name?: string;
  notes?: string;
}
