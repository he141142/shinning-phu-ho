/**
 * Reports Page
 * Main page for displaying reports with role-based views
 * Includes role selector for testing/demo purposes
 */

import React, { useState } from 'react';
import { ReportWidget } from '@/components/reports/ReportWidget';
import { UserRole } from '@/models/reports/report-types';
import { Button } from '@/components/drake_libs/ui/button';
import { Card, CardContent } from '@/components/drake_libs/ui/card';

export default function ReportsPage() {
  // In production, get role from authentication context/session
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'admin',
      label: 'Admin',
      description: 'View comprehensive institution metrics and analytics',
    },
    {
      value: 'teacher',
      label: 'Teacher',
      description: 'Monitor class performance and student attendance',
    },
    {
      value: 'student',
      label: 'Student',
      description: 'Track personal progress and achievements',
    },
    {
      value: 'accountant',
      label: 'Accountant',
      description: 'Manage financial reports and revenue tracking',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Role Selector (for demo purposes - remove in production) */}
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-blue-900">Demo Mode:</span>
              <span className="text-xs text-blue-700">
                Select a role to view different dashboard views
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    selectedRole === role.value
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white hover:bg-blue-100 text-gray-900'
                  }`}
                >
                  <div className="font-semibold mb-1">{role.label}</div>
                  <div
                    className={`text-xs ${
                      selectedRole === role.value ? 'text-blue-100' : 'text-gray-600'
                    }`}
                  >
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-blue-700 mt-3">
              💡 In production, the role will be automatically determined from the logged-in
              user&apos;s authentication session.
            </p>
          </CardContent>
        </Card>

        {/* Report Widget */}
        <ReportWidget
          role={selectedRole}
          useMockData={true} // Set to false when backend is ready
        />
      </div>
    </div>
  );
}
