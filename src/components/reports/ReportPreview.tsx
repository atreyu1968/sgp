import React from 'react';
import { ReportType, ReportFilter } from '../../types/report';
import StatisticsReport from './StatisticsReport';
import BudgetStatusReport from './BudgetStatusReport';

interface ReportPreviewProps {
  reportType: ReportType;
  filters: ReportFilter[];
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportType,
  filters
}) => {
  // Mock data for preview
  const mockData = {
    projects: [
      {
        id: '1',
        title: 'Sistema IoT',
        category: {
          name: 'Tecnología',
          totalBudget: 10000,
          cutoffScore: 7
        },
        status: 'reviewed',
        center: 'IES Tecnológico',
        department: 'Informática',
        score: 8.5,
        submissionDate: '2024-03-15',
        requestedAmount: 5000,
      },
      {
        id: '2',
        title: 'Plataforma Educativa',
        category: {
          name: 'Educación Digital',
          totalBudget: 8000,
          cutoffScore: 7
        },
        status: 'reviewed',
        center: 'IES Innovación',
        department: 'Pedagogía',
        score: 6.5,
        submissionDate: '2024-03-10',
        requestedAmount: 4000,
      },
      {
        id: '3',
        title: 'Gestión Sostenible',
        category: {
          name: 'Sostenibilidad',
          totalBudget: 12000,
          cutoffScore: 7
        },
        status: 'needs_correction',
        center: 'IES Tecnológico',
        department: 'Medio Ambiente',
        submissionDate: '2024-03-12',
        requestedAmount: 7000,
      }
    ],
    users: [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'admin',
        center: 'IES Tecnológico',
        department: 'Informática',
        active: true,
        lastLogin: '2024-03-15',
      }
    ],
    reviews: [
      {
        id: '1',
        projectId: '1',
        projectTitle: 'Sistema IoT',
        reviewerId: '2',
        reviewerName: 'Ana Martínez',
        score: 8.5,
        status: 'completed',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      }
    ],
    statistics: {
      projectsByCategory: [
        { name: 'Tecnología', count: 15 },
        { name: 'Educación', count: 10 },
        { name: 'Sostenibilidad', count: 8 }
      ],
      projectsByStatus: [
        { name: 'Activo', count: 20 },
        { name: 'En revisión', count: 8 },
        { name: 'Completado', count: 5 }
      ],
      reviewsOverTime: [
        { date: '2024-01', count: 5 },
        { date: '2024-02', count: 8 },
        { date: '2024-03', count: 12 }
      ],
      scoreDistribution: [
        { range: '0-2', count: 1 },
        { range: '2-4', count: 2 },
        { range: '4-6', count: 5 },
        { range: '6-8', count: 15 },
        { range: '8-10', count: 10 }
      ]
    }
  };

  if (reportType === 'statistics') {
    return <StatisticsReport data={mockData.statistics} />;
  }

  if (reportType === 'projects') {
    return <BudgetStatusReport projects={mockData.projects} />;
  }

  const getData = () => mockData[reportType];
  const data = getData();

  const getColumns = (type: ReportType) => {
    switch (type) {
      case 'users':
        return [
          { key: 'id', label: 'ID', width: '80px' },
          { key: 'name', label: 'Nombre', width: '200px' },
          { key: 'email', label: 'Email', width: '200px' },
          { key: 'role', label: 'Rol', width: '120px' },
          { key: 'center', label: 'Centro', width: '200px' },
          { key: 'department', label: 'Departamento', width: '150px' },
          { key: 'active', label: 'Estado', width: '100px' },
          { key: 'lastLogin', label: 'Último acceso', width: '150px' }
        ];
      case 'reviews':
        return [
          { key: 'id', label: 'ID', width: '80px' },
          { key: 'projectTitle', label: 'Proyecto', width: '250px' },
          { key: 'reviewerName', label: 'Revisor', width: '200px' },
          { key: 'score', label: 'Puntuación', width: '100px' },
          { key: 'status', label: 'Estado', width: '120px' },
          { key: 'createdAt', label: 'Fecha', width: '150px' }
        ];
      default:
        return [];
    }
  };

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined) return '-';

    switch (key) {
      case 'score':
        return typeof value === 'number' ? value.toFixed(2) : value;
      case 'active':
        return value ? 'Activo' : 'Inactivo';
      case 'lastLogin':
      case 'createdAt':
      case 'updatedAt':
        return new Date(value).toLocaleDateString('es-ES');
      default:
        return value;
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {getColumns(reportType).map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {getColumns(reportType).map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {formatValue(row[col.key], col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPreview;