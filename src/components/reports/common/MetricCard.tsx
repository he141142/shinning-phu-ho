/**
 * Metric Card Component
 * Displays a single metric with optional trend indicator
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/drake_libs/ui/card';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  format?: 'number' | 'currency' | 'percentage';
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  format = 'number',
  loading = false,
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <MinusIcon className="h-4 w-4" />;
    if (change > 0) return <ArrowUpIcon className="h-4 w-4" />;
    return <ArrowDownIcon className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-gray-500';
    if (change > 0) return 'text-green-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
          {icon && <div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div>}
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <p className={cn('text-xs flex items-center gap-1 mt-1', getTrendColor())}>
            {getTrendIcon()}
            <span>
              {Math.abs(change).toFixed(1)}% {changeLabel}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
