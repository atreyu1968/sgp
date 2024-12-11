import React, { useState } from 'react';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectTable from './ProjectTable';
import { Project } from '../../types/project';
import { useViewMode } from '../../hooks/useViewMode';

interface ProjectsListProps {
  projects: Project[];
  onEditProject: (id: string) => void;
  onNewProject: () => void;
  onViewProject: (project: Project) => void;
  onViewReviews: (project: Project) => void;
  onAssignReviewers: (project: Project) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onEditProject,
  onNewProject,
  onViewProject,
  onViewReviews,
  onAssignReviewers,
}) => {
  const { viewMode, changeViewMode } = useViewMode('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Project['status']>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category?.id === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories from projects
  const categories = Array.from(new Set(projects.map((p) => ({
    id: p.category?.id,
    name: p.category?.name
  }))));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="submitted">Presentado</option>
            <option value="reviewing">En revisión</option>
            <option value="reviewed">Corregido</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
            <option value="needs_changes">Requiere cambios</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => changeViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Vista en cuadrícula"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => changeViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Vista en lista"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron proyectos</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project as any}
              onClick={() => onViewProject(project)}
              onEdit={() => onEditProject(project.id)}
              onView={() => onViewProject(project)}
              onViewReviews={() => onViewReviews(project)}
              onAssignReviewers={() => onAssignReviewers(project)}
            />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onEdit={onEditProject}
          onView={onViewProject}
          onViewReviews={onViewReviews}
          onAssignReviewers={onAssignReviewers}
        />
      )}
    </div>
  );
};

export default ProjectsList;