/**
 * Base Report Widget Component
 * Role-based rendering logic that displays appropriate dashboard based on user role
 * Handles loading states, error boundaries, and data fetching
 */

import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { StudentDashboard } from './dashboards/StudentDashboard';
import {
  UserRole,
  ReportResponse,
  AdminReportResponse,
  TeacherReportResponse,
  StudentReportResponse,
  ExportFormat,
} from '@/models/reports/report-types';
import { getMockReportData } from '@/models/reports/mock-data';
import { DateRange } from './filters/DateRangeFilter';

export interface ReportWidgetProps {
  role: UserRole;
  useMockData?: boolean; // Set to true to use mock data during development
  onFetchData?: (role: UserRole, filters?: any) => Promise<ReportResponse>;
  onExport?: (role: UserRole, format: ExportFormat, filters?: any) => Promise<void>;
}

export const ReportWidget: React.FC<ReportWidgetProps> = ({
  role,
  useMockData = true,
  onFetchData,
  onExport,
}) => {
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (filters?: any) => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData = getMockReportData(role);
        setData(mockData);
      } else if (onFetchData) {
        const result = await onFetchData(role, filters);
        setData(result);
      } else {
        throw new Error('No data fetching method provided');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleFilterChange = (filters: { dateRange?: DateRange }) => {
    fetchData(filters);
  };

  const handleExport = async (format: ExportFormat) => {
    if (onExport) {
      await onExport(role, format);
    } else {
      // Mock export for development
      console.log(`Exporting ${role} report as ${format}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Report</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No report data available</p>
        </div>
      </div>
    );
  }

  // Role-based rendering
  switch (role) {
    case 'admin':
      return (
        <AdminDashboard
          data={data as AdminReportResponse}
          loading={loading}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onFilterChange={handleFilterChange}
        />
      );

    case 'teacher':
      return (
        <TeacherDashboard
          data={data as TeacherReportResponse}
          loading={loading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      );

    case 'student':
      return (
        <StudentDashboard
          data={data as StudentReportResponse}
          loading={loading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      );

    case 'accountant':
      // Accountant view is not yet implemented (blocked as per tasks.md)
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="text-yellow-600 text-5xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Accountant View Coming Soon
            </h3>
            <p className="text-gray-600">
              The accountant dashboard is currently under development. Please check back later.
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600">Invalid role: {role}</p>
          </div>
        </div>
      );
  }
};
