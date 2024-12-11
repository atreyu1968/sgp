import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReviews } from '../context/ReviewsContext';
import { useProjects } from '../context/ProjectsContext';
import { Search, Filter, CheckSquare, Clock, FileText } from 'lucide-react';
import { Project } from '../types/project';
import { Review } from '../types/review';

const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const { reviews } = useReviews();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'completed'>('all');

  if (!user) return null;

  const getReviewsToShow = () => {
    // Admins and coordinators see all reviews
    if (user.role === 'admin' || user.role === 'coordinator') {
      return reviews;
    }
    // Reviewers only see their own reviews
    return reviews.filter(review => review.reviewerId === user.id);
  };

  const getProjectsToShow = () => {
    if (user.role === 'admin' || user.role === 'coordinator') {
      // Show all projects that have reviews
      return projects.filter(project => 
        reviews.some(review => review.projectId === project.id)
      );
    }
    // Show only projects assigned to the reviewer
    return projects.filter(project => 
      project.reviewers?.includes(user.id)
    );
  };

  const filteredReviews = getReviewsToShow().filter(review => {
    const matchesSearch = review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'draft' && review.isDraft) ||
      (statusFilter === 'completed' && !review.isDraft);
    return matchesSearch && matchesStatus;
  });

  const getProjectById = (projectId: string): Project | undefined => {
    return projects.find(p => p.id === projectId);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === 'admin' || user.role === 'coordinator' 
            ? 'Todas las Correcciones'
            : 'Mis Correcciones'}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar correcciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'completed')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borradores</option>
            <option value="completed">Completadas</option>
          </select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron correcciones</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReviews.map((review) => {
            const project = getProjectById(review.projectId);
            if (!project) return null;

            return (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <FileText className="text-gray-400" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {project.center} - {project.department}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    review.isDraft 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {review.isDraft ? 'Borrador' : 'Completada'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="text-blue-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Corrector</p>
                      <p className="text-sm text-gray-900">{review.reviewerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="text-blue-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Última actualización</p>
                      <p className="text-sm text-gray-900">
                        {new Date(review.updatedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>

                  {!review.isDraft && (
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-blue-600">
                        {review.score.toFixed(2)}/10
                      </div>
                    </div>
                  )}
                </div>

                {review.generalObservations && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{review.generalObservations}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;