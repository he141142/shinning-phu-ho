/**
 * Reports Module - Barrel Export
 * Central export point for all report components
 */

// Main Widget
export { ReportWidget } from './ReportWidget';
export type { ReportWidgetProps } from './ReportWidget';

// Dashboards
export { AdminDashboard } from './dashboards/AdminDashboard';
export type { AdminDashboardProps } from './dashboards/AdminDashboard';

export { TeacherDashboard } from './dashboards/TeacherDashboard';
export type { TeacherDashboardProps } from './dashboards/TeacherDashboard';

export { StudentDashboard } from './dashboards/StudentDashboard';
export type { StudentDashboardProps } from './dashboards/StudentDashboard';

// Charts
export { LineChartComponent } from './charts/LineChartComponent';
export type { LineChartComponentProps, LineChartData } from './charts/LineChartComponent';

export { BarChartComponent } from './charts/BarChartComponent';
export type { BarChartComponentProps, BarChartData } from './charts/BarChartComponent';

// Filters
export { DateRangeFilter } from './filters/DateRangeFilter';
export type { DateRangeFilterProps, DateRange } from './filters/DateRangeFilter';

// Common Components
export { MetricCard } from './common/MetricCard';
export type { MetricCardProps } from './common/MetricCard';

export { ExportButton } from './common/ExportButton';
export type { ExportButtonProps } from './common/ExportButton';
