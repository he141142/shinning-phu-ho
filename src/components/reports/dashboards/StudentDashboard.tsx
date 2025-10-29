/**
 * Student Dashboard Component
 * Displays personal progress and attendance metrics for student role
 * - Attendance percentage
 * - Progress percentage
 * - Subject-wise performance
 * - Progress trend over time
 * - Motivational messages
 */

import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { ExportButton } from '../common/ExportButton';
import { LineChartComponent } from '../charts/LineChartComponent';
import { BarChartComponent } from '../charts/BarChartComponent';
import { StudentReportResponse, ExportFormat } from '@/models/reports/report-types';
import { BookOpenIcon, TrendingUpIcon, TargetIcon, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/drake_libs/ui/button';
import { RefreshCwIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/drake_libs/ui/card';
import { Badge } from '@/components/drake_libs/ui/badge';

export interface StudentDashboardProps {
  data: StudentReportResponse;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: ExportFormat) => Promise<void>;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  data,
  loading = false,
  onRefresh,
  onExport,
}) => {
  const handleExport = async (format: ExportFormat) => {
    if (onExport) {
      await onExport(format);
    } else {
      // Mock export for development
      console.log(`Exporting as ${format}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <MinusIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-50 text-green-700 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  // Prepare chart data
  const performanceChartData = data.summary.subjectsPerformance.map((subject) => ({
    subject: subject.subjectName,
    score: subject.score,
  }));

  const progressChartData = data.summary.progressTrend.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    progress: point.value,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Progress</h1>
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

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Keep it up!</h3>
              <p className="text-gray-700">{data.summary.motivationalMessage}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Attendance Rate"
          value={data.summary.attendancePercentage}
          icon={<BookOpenIcon className="h-4 w-4" />}
          format="percentage"
          loading={loading}
        />
        <MetricCard
          title="Overall Progress"
          value={data.summary.progressPercentage}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          format="percentage"
          loading={loading}
        />
        <MetricCard
          title="Overall Grade"
          value={data.summary.overallGrade}
          icon={<TargetIcon className="h-4 w-4" />}
          loading={loading}
        />
      </div>

      {/* Attendance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Classes Attended</span>
              <span className="text-lg font-semibold">{data.summary.totalClassesAttended}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Classes</span>
              <span className="text-lg font-semibold">{data.summary.totalClasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Missed Classes</span>
              <span className="text-lg font-semibold text-red-600">
                {data.summary.totalClasses - data.summary.totalClassesAttended}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Trend Chart */}
      <LineChartComponent
        data={progressChartData}
        title="Progress Over Time (Last 6 Months)"
        xKey="date"
        yKey="progress"
        lineColor="#8b5cf6"
        height={300}
      />

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {data.summary.subjectsPerformance.map((subject) => (
              <div
                key={subject.subjectId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getTrendIcon(subject.trend)}
                  <span className="font-medium">{subject.subjectName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{subject.score}</span>
                  <Badge variant="outline" className={getGradeColor(subject.grade)}>
                    {subject.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <BarChartComponent
            data={performanceChartData}
            title="Scores by Subject"
            xKey="subject"
            yKey="score"
            barColor="#3b82f6"
            height={300}
          />
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Maintain consistent attendance to stay on track with your coursework</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Focus on subjects showing a downward trend to improve overall performance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Celebrate your achievements in subjects where you're performing well</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Talk to your teachers if you need additional help or guidance</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
