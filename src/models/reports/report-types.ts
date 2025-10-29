/**
 * Report Schema Types
 * These types define the structure of report data for the backend and frontend.
 * Separated for clean architecture - backend can implement these interfaces.
 */

// Role types
export type UserRole = 'admin' | 'teacher' | 'student' | 'accountant';

// Common filter types
export interface DateRangeFilter {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface ReportFilters extends DateRangeFilter {
  branchId?: number;
  teacherId?: number;
  classId?: number;
  studentId?: number;
}

// Admin Report Types
export interface AdminReportSummary {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  monthlyRevenue: number;
  revenueChange: number; // percentage change
  studentsChange: number; // percentage change
  teachersChange: number; // percentage change
  classesChange: number; // percentage change
}

export interface AdminReportResponse {
  summary: AdminReportSummary;
  filters?: ReportFilters;
  lastUpdated: string; // ISO timestamp
}

// Teacher Report Types
export interface LowAttendanceStudent {
  studentId: number;
  studentName: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  absences: number;
}

export interface ClassPerformanceSummary {
  classId: number;
  className: string;
  totalStudents: number;
  averageAttendance: number;
  averagePerformance: number;
  lowAttendanceStudents: LowAttendanceStudent[];
}

export interface TeacherReportSummary {
  assignedClasses: number;
  totalStudents: number;
  averageAttendanceRate: number;
  classesDetails: ClassPerformanceSummary[];
}

export interface TeacherReportResponse {
  summary: TeacherReportSummary;
  filters?: ReportFilters;
  lastUpdated: string;
}

// Student Report Types
export interface SubjectPerformance {
  subjectId: number;
  subjectName: string;
  score: number;
  grade: string;
  trend: 'up' | 'down' | 'stable'; // performance trend
}

export interface ProgressDataPoint {
  date: string; // ISO date
  value: number; // progress percentage
  subject?: string;
}

export interface StudentReportSummary {
  attendancePercentage: number;
  progressPercentage: number;
  overallGrade: string;
  subjectsPerformance: SubjectPerformance[];
  progressTrend: ProgressDataPoint[]; // last 6 months
  totalClassesAttended: number;
  totalClasses: number;
  motivationalMessage: string;
}

export interface StudentReportResponse {
  summary: StudentReportSummary;
  filters?: DateRangeFilter;
  lastUpdated: string;
}

// Accountant Report Types (for future implementation)
export interface PaymentSummary {
  totalRevenue: number;
  outstandingFees: number;
  paidStudents: number;
  unpaidStudents: number;
  partiallyPaidStudents: number;
}

export interface AccountantReportSummary {
  paymentSummary: PaymentSummary;
  revenueByMonth: { month: string; revenue: number }[];
  // Add more fields as requirements are clarified
}

export interface AccountantReportResponse {
  summary: AccountantReportSummary;
  filters?: ReportFilters;
  lastUpdated: string;
}

// Generic report response type
export type ReportResponse =
  | AdminReportResponse
  | TeacherReportResponse
  | StudentReportResponse
  | AccountantReportResponse;

// Export format types
export type ExportFormat = 'pdf' | 'csv';

export interface ExportRequest {
  format: ExportFormat;
  reportType: UserRole;
  filters?: ReportFilters;
}

export interface ExportResponse {
  downloadUrl: string;
  fileName: string;
  expiresAt: string; // ISO timestamp
}
