import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/drake_libs/ui/card';
import { Button } from '@/components/drake_libs/ui/button';
import { Input } from '@/components/drake_libs/ui/input';
import { Badge } from '@/components/drake_libs/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/drake_libs/ui/select';
import { Search, Download, Calendar, Filter } from 'lucide-react';
import type { AttendanceStatus } from '@/models/attendance/Attendance';

export default function AttendanceOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');

  // Mock data - replace with actual API call
  const attendanceData = [
    {
      id: 1,
      date: '2025-10-29',
      class_name: 'English 101',
      student_name: 'John Doe',
      status: 'present' as AttendanceStatus,
      recorded_by: 'Teacher Smith',
    },
    // Add more mock data as needed
  ];

  const getStatusBadge = (status: AttendanceStatus) => {
    const variants = {
      present: { variant: 'default' as const, className: 'bg-green-500' },
      absent: { variant: 'destructive' as const, className: '' },
      late: { variant: 'secondary' as const, className: 'bg-amber-500' },
      excused: { variant: 'outline' as const, className: '' },
    };
    return variants[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <Card className="mb-6 shadow-xl">
          <div className="relative h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-t-xl">
            <div className="relative h-full flex items-center justify-between px-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Attendance Overview</h1>
                <p className="text-white/90">Admin Dashboard</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students, classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AttendanceStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Button>

              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Recorded By</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {attendanceData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 text-sm">{record.date}</td>
                      <td className="px-4 py-4 text-sm font-medium">{record.class_name}</td>
                      <td className="px-4 py-4 text-sm">{record.student_name}</td>
                      <td className="px-4 py-4">
                        <Badge {...getStatusBadge(record.status)} className="capitalize">
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{record.recorded_by}</td>
                      <td className="px-4 py-4">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
