import { UserRole } from './user';

export type ReportType = 'projects' | 'users' | 'reviews' | 'statistics';

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'before' | 'after';
  value: any;
}

export interface ReportColumn {
  field: string;
  header: string;
  width?: number;
}

export interface ReportData {
  columns: ReportColumn[];
  rows: any[];
}

export interface ReportConfig {
  title: string;
  sheetName: string;
  columns: ReportColumn[];
  filters?: ReportFilter[];
}

export interface FilterField {
  value: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: Array<{
    value: string;
    label: string;
  }>;
}