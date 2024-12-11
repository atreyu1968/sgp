import React, { useMemo } from 'react';
import { Project } from '../../types/project';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface BudgetStatusReportProps {
  projects: Project[];
}

const BudgetStatusReport: React.FC<BudgetStatusReportProps> = ({ projects }) => {
  const groupedProjects = useMemo(() => {
    const approved: Project[] = [];
    const rejected: Project[] = [];
    const needsCorrection: Project[] = [];
    let totalBudgetUsed = 0;

    // Sort projects by score in descending order
    const sortedProjects = [...projects].sort((a, b) => 
      (b.score || 0) - (a.score || 0)
    );

    sortedProjects.forEach(project => {
      const categoryBudget = project.category?.totalBudget || 0;
      const requestedAmount = project.requestedAmount || 0;
      const cutoffScore = project.category?.cutoffScore || 7;

      if (project.status === 'needs_correction' || 
          project.status === 'correction_in_progress' ||
          project.status === 'correction_submitted') {
        needsCorrection.push(project);
      }
      else if (project.score && project.score >= cutoffScore) {
        if (totalBudgetUsed + requestedAmount <= categoryBudget) {
          approved.push(project);
          totalBudgetUsed += requestedAmount;
        } else {
          rejected.push({
            ...project,
            rejectionReason: 'Presupuesto agotado'
          });
        }
      } else if (project.score) {
        rejected.push({
          ...project,
          rejectionReason: 'No alcanza la nota de corte'
        });
      }
    });

    return { approved, rejected, needsCorrection, totalBudgetUsed };
  }, [projects]);

  const formatCurrency = (amount: number) => 
    amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

  return (
    <div className="space-y-8">
      {/* Approved Projects */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="text-green-500" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">
            Proyectos Aprobados
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyecto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntuación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedProjects.approved.map(project => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.center}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.category?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">
                      {project.score?.toFixed(2)}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(project.requestedAmount || 0)}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-50">
                <td colSpan={3} className="px-6 py-4 text-sm font-medium text-green-700">
                  Total asignado
                </td>
                <td className="px-6 py-4 text-sm font-bold text-green-700">
                  {formatCurrency(groupedProjects.totalBudgetUsed)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Projects Needing Correction */}
      {groupedProjects.needsCorrection.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-100">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="text-yellow-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">
              Proyectos en Subsanación
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedProjects.needsCorrection.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500">{project.center}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.category?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(project.requestedAmount || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejected Projects */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
        <div className="flex items-center space-x-2 mb-4">
          <XCircle className="text-red-500" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">
            Proyectos No Aprobados
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyecto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntuación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedProjects.rejected.map(project => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.center}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.category?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-red-600">
                      {project.score?.toFixed(2)}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {(project as any).rejectionReason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetStatusReport;