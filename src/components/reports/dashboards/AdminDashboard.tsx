/**
 * Admin Dashboard Component
 * Displays comprehensive metrics for admin role
 * - Total students, teachers, classes, revenue
 * - Filters by date range, branch, teacher
 */

import React, { useState } from 'react';
import { MetricCard } from '../common/MetricCard';
import { ExportButton } from '../common/ExportButton';
import { DateRangeFilter, DateRange } from '../filters/DateRangeFilter';
import { AdminReportResponse, ExportFormat } from '@/models/reports/report-types';
import { UsersIcon, GraduationCapIcon, BookOpenIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '@/components/drake_libs/ui/button';
import { RefreshCwIcon } from 'lucide-react';

export interface AdminDashboardProps {
  data: AdminReportResponse;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: ExportFormat) => Promise<void>;
  onFilterChange?: (filters: { dateRange?: DateRange }) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  loading = false,
  onRefresh,
  onExport,
  onFilterChange,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    data.filters
      ? {
          from: new Date(data.filters.startDate),
          to: new Date(data.filters.endDate),
        }
      : undefined
  );

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    onFilterChange?.({ dateRange: range });
  };

  const handleExport = async (format: ExportFormat) => {
    if (onExport) {
      await onExport(format);
    } else {
      // Mock export for development
      console.log(`Exporting as ${format}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} disabled={loading}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
          <ExportButton onExport={handleExport} disabled={loading} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium mb-3">Filters</h3>
        <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Students"
          value={data.summary.totalStudents}
          change={data.summary.studentsChange}
          icon={<UsersIcon className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Total Teachers"
          value={data.summary.totalTeachers}
          change={data.summary.teachersChange}
          icon={<GraduationCapIcon className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Total Classes"
          value={data.summary.totalClasses}
          change={data.summary.classesChange}
          icon={<BookOpenIcon className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Monthly Revenue"
          value={data.summary.monthlyRevenue}
          change={data.summary.revenueChange}
          icon={<DollarSignIcon className="h-4 w-4" />}
          format="currency"
          loading={loading}
        />
      </div>

      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Overview</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Your institution is currently managing <strong>{data.summary.totalClasses}</strong>{' '}
            active classes with <strong>{data.summary.totalTeachers}</strong> teachers serving{' '}
            <strong>{data.summary.totalStudents}</strong> students.
          </p>
          <p className="text-sm text-gray-700">
            Revenue for this period is{' '}
            <strong>${data.summary.monthlyRevenue.toLocaleString()}</strong>, showing a{' '}
            {data.summary.revenueChange > 0 ? 'growth' : 'decline'} of{' '}
            <strong>{Math.abs(data.summary.revenueChange).toFixed(1)}%</strong> compared to the
            previous period.
          </p>
        </div>
      </div>
    </div>
  );
};
