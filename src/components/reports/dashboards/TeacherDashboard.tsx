/**
 * Teacher Dashboard Component
 * Displays class and attendance metrics for teacher role
 * - Assigned classes count
 * - Total students
 * - Average attendance rate
 * - List of low-attendance students by class
 */

import React, { useState } from 'react';
import { MetricCard } from '../common/MetricCard';
import { ExportButton } from '../common/ExportButton';
import { TeacherReportResponse, ExportFormat } from '@/models/reports/report-types';
import { BookOpenIcon, UsersIcon, BarChartIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/drake_libs/ui/button';
import { RefreshCwIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/drake_libs/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/drake_libs/ui/table';
import { Badge } from '@/components/drake_libs/ui/badge';

export interface TeacherDashboardProps {
  data: TeacherReportResponse;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: ExportFormat) => Promise<void>;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  data,
  loading = false,
  onRefresh,
  onExport,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(
    data.summary.classesDetails[0]?.classId || null
  );

  const handleExport = async (format: ExportFormat) => {
    if (onExport) {
      await onExport(format);
    } else {
      // Mock export for development
      console.log(`Exporting as ${format}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const selectedClass = data.summary.classesDetails.find((c) => c.classId === selectedClassId);

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Good</Badge>;
    if (percentage >= 70) return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Low</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Assigned Classes"
          value={data.summary.assignedClasses}
          icon={<BookOpenIcon className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Total Students"
          value={data.summary.totalStudents}
          icon={<UsersIcon className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Average Attendance"
          value={data.summary.averageAttendanceRate}
          icon={<BarChartIcon className="h-4 w-4" />}
          format="percentage"
          loading={loading}
        />
      </div>

      {/* Class Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Classes Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.summary.classesDetails.map((cls) => (
              <Button
                key={cls.classId}
                variant={selectedClassId === cls.classId ? 'default' : 'outline'}
                onClick={() => setSelectedClassId(cls.classId)}
                size="sm"
              >
                {cls.className}
              </Button>
            ))}
          </div>

          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold">{selectedClass.totalStudents}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Attendance</p>
                  <p className="text-2xl font-bold">{selectedClass.averageAttendance.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Performance</p>
                  <p className="text-2xl font-bold">{selectedClass.averagePerformance.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">At-Risk Students</p>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedClass.lowAttendanceStudents.length}
                  </p>
                </div>
              </div>

              {selectedClass.lowAttendanceStudents.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold">Low Attendance Students (Below 70%)</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Attendance Rate</TableHead>
                          <TableHead>Classes Attended</TableHead>
                          <TableHead>Total Classes</TableHead>
                          <TableHead>Absences</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClass.lowAttendanceStudents.map((student) => (
                          <TableRow key={student.studentId}>
                            <TableCell className="font-medium">{student.studentName}</TableCell>
                            <TableCell>
                              <span className={getAttendanceColor(student.attendancePercentage)}>
                                {student.attendancePercentage.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>{student.attendedClasses}</TableCell>
                            <TableCell>{student.totalClasses}</TableCell>
                            <TableCell>{student.absences}</TableCell>
                            <TableCell>{getAttendanceBadge(student.attendancePercentage)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {selectedClass.lowAttendanceStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">No students with low attendance in this class!</p>
                  <p className="text-sm mt-2">All students are maintaining good attendance records.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
