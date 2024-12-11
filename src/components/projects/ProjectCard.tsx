import React from 'react';
import { FileText, Users, Calendar, Star, Eye, Edit, UserPlus, ClipboardList } from 'lucide-react';
import { Project, statusColors, statusLabels } from '../../types/project';

interface ProjectWithReviewers extends Project {
  mappedReviewers: Array<{ id: string; name: string; hasReviewed: boolean }>;
}

interface ProjectCardProps {
  project: ProjectWithReviewers;
  onClick: () => void;
  onEdit: () => void;
  onView: () => void;
  onViewReviews: () => void;
  onAssignReviewers: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onEdit,
  onView,
  onViewReviews,
  onAssignReviewers,
}) => {
  const getReviewStatusColor = () => {
    if (project.status === 'draft') return 'border-l-4 border-gray-300';
    
    const reviewers = project.reviewers || [];
    const minReviews = project.category?.minCorrections || 2;
    const completedReviews = project.reviews?.filter(r => !r.isDraft).length || 0;

    if (completedReviews === 0) return 'border-l-4 border-red-500';
    if (completedReviews < minReviews) return 'border-l-4 border-orange-500';
    return 'border-l-4 border-green-500';
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer ${getReviewStatusColor()}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[project.status].bg
        } ${statusColors[project.status].text}`}>
          {statusLabels[project.status]}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>{new Date(project.submissionDate || '').toLocaleDateString('es-ES')}</span>
          </div>
          {project.score && (
            <div className="flex items-center space-x-1 text-sm font-medium text-blue-600">
              <Star size={16} />
              <span>{project.score.toFixed(1)}/10</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FileText size={16} />
          <span>{project.category?.name}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{project.center} - {project.department}</span>
        </div>

        {/* Presenters section */}
        {project.presenters && project.presenters.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users size={16} className="text-blue-500" />
            <div className="flex flex-wrap gap-1">
              {project.presenters.map((presenter, index) => (
                <span key={presenter} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {presenter}
                  {index < project.presenters!.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviewers section */}
        {project.reviewers && project.reviewers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClipboardList size={16} className="text-green-500" />
            <div className="flex flex-wrap gap-1">
              {project.reviewers.map((reviewer, index) => (
                <span key={reviewer} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  {reviewer}
                  {index < project.reviewers!.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-end space-x-2">
          {project.status !== 'draft' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssignReviewers();
              }}
              className="btn btn-secondary flex items-center space-x-2 text-sm"
              title="Asignar correctores"
            >
              <UserPlus size={16} />
              <span>Asignar</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewReviews();
            }}
            className="btn btn-secondary flex items-center space-x-2 text-sm"
            title="Ver correcciones"
          >
            <ClipboardList size={16} />
            <span>Correcciones</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="btn btn-secondary flex items-center space-x-2 text-sm"
            title="Ver proyecto"
          >
            <Eye size={16} />
            <span>Ver</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="btn btn-primary flex items-center space-x-2 text-sm"
            title="Editar proyecto"
          >
            <Edit size={16} />
            <span>Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;