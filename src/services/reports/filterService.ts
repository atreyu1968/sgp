import { ReportFilter } from '../../types/report';

export function applyFilters<T>(data: T[], filters: ReportFilter[]): T[] {
  return data.filter(item => 
    filters.every(filter => matchesFilter(item, filter))
  );
}

function matchesFilter(item: any, filter: ReportFilter): boolean {
  const value = item[filter.field];
  
  switch (filter.operator) {
    case 'equals':
      return value === filter.value;
    
    case 'not_equals':
      return value !== filter.value;
    
    case 'contains':
      return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    
    case 'greater_than':
      return Number(value) > Number(filter.value);
    
    case 'less_than':
      return Number(value) < Number(filter.value);
    
    case 'between':
      const [min, max] = filter.value;
      return Number(value) >= Number(min) && Number(value) <= Number(max);
    
    case 'in':
      return Array.isArray(filter.value) && filter.value.includes(value);
    
    case 'before':
      return new Date(value) < new Date(filter.value);
    
    case 'after':
      return new Date(value) > new Date(filter.value);
    
    default:
      return true;
  }
}