/**
 * Reports Models - Barrel Export
 * Central export point for all report types and mock data
 */

// Types
export type {
  UserRole,
  DateRangeFilter,
  ReportFilters,
  AdminReportSummary,
  AdminReportResponse,
  LowAttendanceStudent,
  ClassPerformanceSummary,
  TeacherReportSummary,
  TeacherReportResponse,
  SubjectPerformance,
  ProgressDataPoint,
  StudentReportSummary,
  StudentReportResponse,
  PaymentSummary,
  AccountantReportSummary,
  AccountantReportResponse,
  ReportResponse,
  ExportFormat,
  ExportRequest,
  ExportResponse,
} from './report-types';

// Mock Data
export {
  mockAdminReportData,
  mockTeacherReportData,
  mockStudentReportData,
  mockAccountantReportData,
  getMockReportData,
} from './mock-data';
