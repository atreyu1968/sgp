import React from 'react';
import { Eye, Edit, UserPlus, ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import { Project, statusColors, statusLabels } from '../../types/project';
import { useAuth } from '../../hooks/useAuth';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (id: string) => void;
  onView: (project: Project) => void;
  onViewReviews: (project: Project) => void;
  onAssignReviewers: (project: Project) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onEdit,
  onView,
  onViewReviews,
  onAssignReviewers,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isCoordinator = user?.role === 'coordinator';
  const canManageReviewers = isAdmin || isCoordinator;

  const getReviewStatusColor = (project: Project) => {
    if (project.status === 'draft') return 'border-l-4 border-gray-300';
    
    const reviewers = project.reviewers || [];
    const minReviews = project.category?.minCorrections || 2;
    const completedReviews = project.reviews?.filter(r => !r.isDraft).length || 0;

    if (completedReviews === 0) return 'border-l-4 border-red-500';
    if (completedReviews < minReviews) return 'border-l-4 border-orange-500';
    return 'border-l-4 border-green-500';
  };

  const getScoreIndicator = (project: Project) => {
    if (project.status === 'draft' || project.status === 'submitted') return null;
    if (!project.score) return null;

    const cutoffScore = project.category?.cutoffScore || 5;
    const isAboveCutoff = project.score >= cutoffScore;

    return (
      <div className="flex items-center space-x-2">
        <span className="font-semibold">{project.score.toFixed(2)}</span>
        {isAboveCutoff ? (
          <CheckCircle className="text-green-500" size={16} />
        ) : (
          <XCircle className="text-red-500" size={16} />
        )}
      </div>
    );
  };

  return (
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
              Centro
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Correctores
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Puntuación
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className={`hover:bg-gray-50 ${getReviewStatusColor(project)}`}>
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{project.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{project.description}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.category?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{project.center}</div>
                <div className="text-sm text-gray-500">{project.department}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[project.status].bg
                } ${statusColors[project.status].text}`}>
                  {statusLabels[project.status]}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  {project.reviewers?.map((reviewer, index) => (
                    <div 
                      key={`${project.id}-${reviewer}`} 
                      className={`${
                        project.reviews?.some(r => r.reviewerId === reviewer && !r.isDraft)
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {reviewer}
                    </div>
                  ))}
                  {!project.reviewers?.length && (
                    <span className="text-gray-400">Sin asignar</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getScoreIndicator(project)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {project.status !== 'draft' && canManageReviewers && (
                    <button
                      onClick={() => onAssignReviewers(project)}
                      className="btn btn-secondary flex items-center space-x-2 text-sm"
                    >
                      <UserPlus size={16} />
                      <span>Asignar</span>
                    </button>
                  )}
                  <button
                    onClick={() => onViewReviews(project)}
                    className="btn btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <ClipboardList size={16} />
                    <span>Correcciones</span>
                  </button>
                  <button
                    onClick={() => onView(project)}
                    className="btn btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <Eye size={16} />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => onEdit(project.id)}
                    className="btn btn-primary flex items-center space-x-2 text-sm"
                  >
                    <Edit size={16} />
                    <span>Editar</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;