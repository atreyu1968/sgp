import React, { useState } from 'react';
import { FileSpreadsheet, Download, Filter, Loader2 } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import ReportFilters from '../components/reports/ReportFilters';
import ReportPreview from '../components/reports/ReportPreview';
import { generateExcelReport } from '../services/reportService';
import { ReportType, ReportFilter } from '../types/report';

const ReportsPage: React.FC = () => {
  const { canExport } = usePermissions();
  const [selectedReport, setSelectedReport] = useState<ReportType>('projects');
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!canExport('reports')) return;
    
    setIsGenerating(true);
    try {
      await generateExcelReport(selectedReport, filters);
    } catch (error) {
      console.error('Error generating report:', error);
      // TODO: Show error toast
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Genera informes detallados en formato Excel
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating || !canExport('reports')}
          className="btn btn-primary flex items-center space-x-2"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileSpreadsheet size={20} />
          )}
          <span>{isGenerating ? 'Generando...' : 'Generar Excel'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Controls Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Informe
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value as ReportType)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="projects">Proyectos</option>
                <option value="users">Usuarios</option>
                <option value="reviews">Revisiones</option>
                <option value="statistics">Estadísticas</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Filtros
                </label>
                <Filter size={20} className="text-gray-400" />
              </div>
              <ReportFilters
                reportType={selectedReport}
                filters={filters}
                onChange={setFilters}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <ReportPreview
              reportType={selectedReport}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;