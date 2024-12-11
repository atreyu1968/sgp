import React from 'react';
import { Plus, X } from 'lucide-react';
import { ReportType, ReportFilter } from '../../types/report';
import { useMasterData } from '../../context/MasterDataContext';
import { statusLabels } from '../../types/project';
import { roleLabels } from '../../types/user';

interface ReportFiltersProps {
  reportType: ReportType;
  filters: ReportFilter[];
  onChange: (filters: ReportFilter[]) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  reportType,
  filters,
  onChange
}) => {
  const { specialties, centers, families, cycles } = useMasterData();

  const getAvailableFields = (type: ReportType) => {
    switch (type) {
      case 'projects':
        return [
          { value: 'category', label: 'Categoría', type: 'select', options: families.map(f => ({ value: f.id, label: f.name })) },
          { value: 'status', label: 'Estado', type: 'select', options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })) },
          { value: 'center', label: 'Centro', type: 'select', options: centers.map(c => ({ value: c.id, label: c.name })) },
          { value: 'department', label: 'Departamento', type: 'select', options: cycles.map(c => ({ value: c.id, label: c.name })) },
          { value: 'specialty', label: 'Especialidad', type: 'select', options: specialties.map(s => ({ value: s.id, label: s.name })) },
          { value: 'score', label: 'Puntuación', type: 'number' },
          { value: 'requestedAmount', label: 'Importe solicitado', type: 'number' },
          { value: 'submissionDate', label: 'Fecha de Presentación', type: 'date' },
          { value: 'reviewStatus', label: 'Estado de revisión', type: 'select', options: [
            { value: 'pending', label: 'Pendiente' },
            { value: 'in_progress', label: 'En revisión' },
            { value: 'completed', label: 'Completada' }
          ]},
          { value: 'correctionStatus', label: 'Estado de subsanación', type: 'select', options: [
            { value: 'none', label: 'Sin subsanación' },
            { value: 'requested', label: 'Solicitada' },
            { value: 'in_progress', label: 'En proceso' },
            { value: 'submitted', label: 'Presentada' }
          ]}
        ];
      case 'users':
        return [
          { value: 'role', label: 'Rol', type: 'select', options: Object.entries(roleLabels).map(([value, label]) => ({ value, label })) },
          { value: 'center', label: 'Centro', type: 'select', options: centers.map(c => ({ value: c.id, label: c.name })) },
          { value: 'department', label: 'Departamento', type: 'select', options: cycles.map(c => ({ value: c.id, label: c.name })) },
          { value: 'specialty', label: 'Especialidad', type: 'select', options: specialties.map(s => ({ value: s.id, label: s.name })) },
          { value: 'active', label: 'Estado', type: 'select', options: [
            { value: 'true', label: 'Activo' },
            { value: 'false', label: 'Inactivo' }
          ]},
          { value: 'lastLogin', label: 'Último Acceso', type: 'date' }
        ];
      case 'reviews':
        return [
          { value: 'score', label: 'Puntuación', type: 'number' },
          { value: 'status', label: 'Estado', type: 'select', options: [
            { value: 'draft', label: 'Borrador' },
            { value: 'completed', label: 'Completada' }
          ]},
          { value: 'category', label: 'Categoría', type: 'select', options: families.map(f => ({ value: f.id, label: f.name })) },
          { value: 'center', label: 'Centro', type: 'select', options: centers.map(c => ({ value: c.id, label: c.name })) },
          { value: 'reviewer', label: 'Revisor', type: 'select', options: [] }, // Populated from users with reviewer role
          { value: 'createdAt', label: 'Fecha de Creación', type: 'date' }
        ];
      case 'statistics':
        return [
          { value: 'category', label: 'Categoría', type: 'select', options: families.map(f => ({ value: f.id, label: f.name })) },
          { value: 'period', label: 'Período', type: 'select', options: [
            { value: 'current', label: 'Actual' },
            { value: 'last_month', label: 'Último mes' },
            { value: 'last_quarter', label: 'Último trimestre' },
            { value: 'last_year', label: 'Último año' }
          ]},
          { value: 'center', label: 'Centro', type: 'select', options: centers.map(c => ({ value: c.id, label: c.name })) }
        ];
      default:
        return [];
    }
  };

  const getOperators = (fieldType: string) => {
    switch (fieldType) {
      case 'select':
        return [
          { value: 'equals', label: 'Es igual a' },
          { value: 'not_equals', label: 'No es igual a' },
          { value: 'in', label: 'Está en' }
        ];
      case 'number':
        return [
          { value: 'equals', label: 'Igual a' },
          { value: 'greater_than', label: 'Mayor que' },
          { value: 'less_than', label: 'Menor que' },
          { value: 'between', label: 'Entre' }
        ];
      case 'date':
        return [
          { value: 'equals', label: 'En' },
          { value: 'before', label: 'Antes de' },
          { value: 'after', label: 'Después de' },
          { value: 'between', label: 'Entre' }
        ];
      default:
        return [
          { value: 'equals', label: 'Es igual a' },
          { value: 'contains', label: 'Contiene' }
        ];
    }
  };

  const addFilter = () => {
    const fields = getAvailableFields(reportType);
    if (fields.length === 0) return;

    const newFilter: ReportFilter = {
      field: fields[0].value,
      operator: 'equals',
      value: ''
    };

    onChange([...filters, newFilter]);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onChange(newFilters);
  };

  const updateFilter = (index: number, field: string, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    onChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {filters.map((filter, index) => {
        const fieldConfig = getAvailableFields(reportType).find(f => f.value === filter.field);
        
        return (
          <div key={index} className="flex items-center space-x-2">
            <select
              value={filter.field}
              onChange={(e) => updateFilter(index, 'field', e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              {getAvailableFields(reportType).map(field => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>

            <select
              value={filter.operator}
              onChange={(e) => updateFilter(index, 'operator', e.target.value)}
              className="w-40 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              {getOperators(fieldConfig?.type || 'text').map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>

            {fieldConfig?.type === 'select' ? (
              <select
                value={filter.value}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccionar valor</option>
                {fieldConfig.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : fieldConfig?.type === 'date' ? (
              <input
                type="date"
                value={filter.value}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <input
                type={fieldConfig?.type || 'text'}
                value={filter.value}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Valor"
              />
            )}

            <button
              onClick={() => removeFilter(index)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
        );
      })}

      <button
        onClick={addFilter}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500"
      >
        <Plus size={20} />
        <span>Añadir filtro</span>
      </button>
    </div>
  );
};

export default ReportFilters;