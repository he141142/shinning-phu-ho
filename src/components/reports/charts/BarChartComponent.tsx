/**
 * Reusable Bar Chart Component
 * Uses Recharts for data visualization
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/drake_libs/ui/card';

export interface BarChartData {
  [key: string]: string | number;
}

export interface BarChartComponentProps {
  data: BarChartData[];
  title: string;
  xKey: string;
  yKey: string;
  barColor?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  height?: number;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
  xKey,
  yKey,
  barColor = '#10b981',
  showGrid = true,
  showLegend = true,
  height = 300,
}) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Bar dataKey={yKey} fill={barColor} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
