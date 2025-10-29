/**
 * Mock Data for Reports
 * This file provides mock data for all report types during development.
 * Replace these with actual API calls when backend is ready.
 */

import {
  AdminReportResponse,
  TeacherReportResponse,
  StudentReportResponse,
  AccountantReportResponse,
} from './report-types';

// Mock Admin Report Data
export const mockAdminReportData: AdminReportResponse = {
  summary: {
    totalStudents: 1245,
    totalTeachers: 87,
    totalClasses: 156,
    monthlyRevenue: 450000,
    revenueChange: 12.5,
    studentsChange: 8.3,
    teachersChange: 5.2,
    classesChange: 10.1,
  },
  filters: {
    startDate: '2025-10-01',
    endDate: '2025-10-28',
  },
  lastUpdated: new Date().toISOString(),
};

// Mock Teacher Report Data
export const mockTeacherReportData: TeacherReportResponse = {
  summary: {
    assignedClasses: 5,
    totalStudents: 125,
    averageAttendanceRate: 85.5,
    classesDetails: [
      {
        classId: 1,
        className: 'Mathematics 101',
        totalStudents: 25,
        averageAttendance: 88.5,
        averagePerformance: 82.3,
        lowAttendanceStudents: [
          {
            studentId: 101,
            studentName: 'John Doe',
            attendancePercentage: 65.0,
            totalClasses: 20,
            attendedClasses: 13,
            absences: 7,
          },
          {
            studentId: 102,
            studentName: 'Jane Smith',
            attendancePercentage: 68.5,
            totalClasses: 20,
            attendedClasses: 14,
            absences: 6,
          },
        ],
      },
      {
        classId: 2,
        className: 'Physics Advanced',
        totalStudents: 22,
        averageAttendance: 90.2,
        averagePerformance: 85.7,
        lowAttendanceStudents: [
          {
            studentId: 103,
            studentName: 'Bob Wilson',
            attendancePercentage: 69.0,
            totalClasses: 20,
            attendedClasses: 14,
            absences: 6,
          },
        ],
      },
      {
        classId: 3,
        className: 'Chemistry Basics',
        totalStudents: 28,
        averageAttendance: 82.1,
        averagePerformance: 78.9,
        lowAttendanceStudents: [
          {
            studentId: 104,
            studentName: 'Alice Brown',
            attendancePercentage: 62.5,
            totalClasses: 20,
            attendedClasses: 13,
            absences: 7,
          },
          {
            studentId: 105,
            studentName: 'Charlie Davis',
            attendancePercentage: 67.0,
            totalClasses: 20,
            attendedClasses: 13,
            absences: 7,
          },
        ],
      },
      {
        classId: 4,
        className: 'Biology Lab',
        totalStudents: 30,
        averageAttendance: 86.5,
        averagePerformance: 80.2,
        lowAttendanceStudents: [],
      },
      {
        classId: 5,
        className: 'English Literature',
        totalStudents: 20,
        averageAttendance: 79.8,
        averagePerformance: 75.5,
        lowAttendanceStudents: [
          {
            studentId: 106,
            studentName: 'David Lee',
            attendancePercentage: 65.5,
            totalClasses: 20,
            attendedClasses: 13,
            absences: 7,
          },
        ],
      },
    ],
  },
  filters: {
    startDate: '2025-10-01',
    endDate: '2025-10-28',
  },
  lastUpdated: new Date().toISOString(),
};

// Mock Student Report Data
export const mockStudentReportData: StudentReportResponse = {
  summary: {
    attendancePercentage: 92.5,
    progressPercentage: 85.0,
    overallGrade: 'A',
    subjectsPerformance: [
      {
        subjectId: 1,
        subjectName: 'Mathematics',
        score: 88,
        grade: 'A',
        trend: 'up',
      },
      {
        subjectId: 2,
        subjectName: 'Physics',
        score: 82,
        grade: 'B+',
        trend: 'stable',
      },
      {
        subjectId: 3,
        subjectName: 'Chemistry',
        score: 90,
        grade: 'A',
        trend: 'up',
      },
      {
        subjectId: 4,
        subjectName: 'Biology',
        score: 85,
        grade: 'A-',
        trend: 'down',
      },
      {
        subjectId: 5,
        subjectName: 'English',
        score: 78,
        grade: 'B',
        trend: 'stable',
      },
    ],
    progressTrend: [
      { date: '2025-05-01', value: 75, subject: 'Overall' },
      { date: '2025-06-01', value: 78, subject: 'Overall' },
      { date: '2025-07-01', value: 80, subject: 'Overall' },
      { date: '2025-08-01', value: 82, subject: 'Overall' },
      { date: '2025-09-01', value: 83, subject: 'Overall' },
      { date: '2025-10-01', value: 85, subject: 'Overall' },
    ],
    totalClassesAttended: 185,
    totalClasses: 200,
    motivationalMessage:
      'Excellent work! Keep up the great effort. You are performing above average in most subjects.',
  },
  filters: {
    startDate: '2025-05-01',
    endDate: '2025-10-28',
  },
  lastUpdated: new Date().toISOString(),
};

// Mock Accountant Report Data
export const mockAccountantReportData: AccountantReportResponse = {
  summary: {
    paymentSummary: {
      totalRevenue: 450000,
      outstandingFees: 75000,
      paidStudents: 1050,
      unpaidStudents: 125,
      partiallyPaidStudents: 70,
    },
    revenueByMonth: [
      { month: '2025-05', revenue: 420000 },
      { month: '2025-06', revenue: 435000 },
      { month: '2025-07', revenue: 445000 },
      { month: '2025-08', revenue: 440000 },
      { month: '2025-09', revenue: 455000 },
      { month: '2025-10', revenue: 450000 },
    ],
  },
  filters: {
    startDate: '2025-05-01',
    endDate: '2025-10-28',
  },
  lastUpdated: new Date().toISOString(),
};

// Helper function to get mock data by role
export const getMockReportData = (
  role: 'admin' | 'teacher' | 'student' | 'accountant'
) => {
  switch (role) {
    case 'admin':
      return mockAdminReportData;
    case 'teacher':
      return mockTeacherReportData;
    case 'student':
      return mockStudentReportData;
    case 'accountant':
      return mockAccountantReportData;
    default:
      throw new Error(`Unknown role: ${role}`);
  }
};
