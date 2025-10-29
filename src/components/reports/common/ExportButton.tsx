/**
 * Export Button Component
 * Provides PDF and CSV export options
 */

import React, { useState } from 'react';
import { Button } from '@/components/drake_libs/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/drake_libs/ui/dropdown-menu';
import { DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react';
import { ExportFormat } from '@/models/reports/report-types';
import { useToast } from '@/components/hooks/use-toast';

export interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled = false }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      await onExport(format);
      toast({
        title: 'Export successful',
        description: `Your ${format.toUpperCase()} file is ready for download.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
          <FileTextIcon className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} disabled={isExporting}>
          <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
