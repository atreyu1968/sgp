import React, { useState } from 'react';
import { X, Plus, Search, Filter, Trash2, Edit, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Project } from '../../types/project';
import { Review } from '../../types/review';
import ReviewModal from './ReviewModal';
import ReviewWizard from './ReviewWizard';
import { useReviews } from '../../context/ReviewsContext';

interface ReviewsListProps {
  project: Project;
  reviews: Review[];
  assignedReviewers: Array<{
    id: string;
    name: string;
    role: string;
    hasReviewed: boolean;
    score?: number;
  }>;
  onClose: () => void;
  onViewReview: (reviewId: string) => void;
  onEditReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  project,
  reviews,
  assignedReviewers,
  onClose,
  onViewReview,
  onEditReview,
  onDeleteReview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'final'>('all');
  const [showReviewWizard, setShowReviewWizard] = useState(false);
  const { user } = useAuth();
  const { addReview } = useReviews();

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'draft' && review.isDraft) ||
      (statusFilter === 'final' && !review.isDraft);
    return matchesSearch && matchesStatus;
  });

  const completedReviews = reviews.filter(r => !r.isDraft).length;
  const minReviews = project.category?.minCorrections || 2;
  const reviewProgress = (completedReviews / minReviews) * 100;

  const canEditReview = (review: Review) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'coordinator') return true;
    return review.isDraft && review.reviewerId === user.id;
  };

  const canDeleteReview = () => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'coordinator';
  };

  const canStartNewReview = () => {
    if (!user) return false;
    
    // Admins and coordinators can always start a review
    if (user.role === 'admin' || user.role === 'coordinator') return true;
    
    // Reviewers can only start if they're assigned and haven't reviewed yet
    if (user.role === 'reviewer') {
      const reviewer = assignedReviewers.find(r => r.id === user.id);
      return reviewer && !reviewer.hasReviewed;
    }
    
    return false;
  };

  const handleNewReview = () => {
    setShowReviewWizard(true);
  };

  const handleSaveReview = async (reviewData: any, isDraft: boolean) => {
    if (!user) return;
    
    try {
      await addReview({
        ...reviewData,
        projectId: project.id,
        reviewerId: user.id,
        reviewerName: user.name,
        isDraft
      });
      setShowReviewWizard(false);
    } catch (error) {
      console.error('Error saving review:', error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Correcciones del Proyecto</h2>
            <p className="mt-1 text-sm text-gray-500">{project.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Estado de las correcciones</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {completedReviews} de {minReviews} correcciones mínimas requeridas
              </span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(reviewProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  completedReviews >= minReviews ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(reviewProgress, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Correctores asignados</h3>
            <div className="space-y-2">
              {assignedReviewers.map(reviewer => (
                <div 
                  key={`${reviewer.role}-${reviewer.id}-${project.id}`}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${reviewer.hasReviewed ? 'text-green-600' : 'text-red-600'}`}>
                      {reviewer.name}
                    </span>
                    {(reviewer.role === 'admin' || reviewer.role === 'coordinator') && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                        {reviewer.role === 'admin' ? 'Admin' : 'Coord'}
                      </span>
                    )}
                  </div>
                  {reviewer.hasReviewed && reviewer.score !== undefined && (
                    <span className="text-sm font-medium">{reviewer.score.toFixed(2)}/10</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por corrector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'final')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borradores</option>
                <option value="final">Finalizadas</option>
              </select>
            </div>

            {canStartNewReview() && (
              <button
                onClick={handleNewReview}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Nueva corrección</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {review.reviewerName}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.isDraft ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {review.isDraft ? 'Borrador' : 'Final'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!review.isDraft && (
                      <div className="text-2xl font-bold text-blue-600">
                        {review.score.toFixed(2)}/10
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onViewReview(review.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Ver corrección"
                      >
                        <Eye size={20} />
                      </button>
                      {onEditReview && canEditReview(review) && (
                        <button
                          onClick={() => onEditReview(review.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Editar corrección"
                        >
                          <Edit size={20} />
                        </button>
                      )}
                      {onDeleteReview && canDeleteReview() && (
                        <button
                          onClick={() => onDeleteReview(review.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Eliminar corrección"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron correcciones</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReviewWizard && (
        <ReviewWizard
          project={project}
          onClose={() => setShowReviewWizard(false)}
          onSave={handleSaveReview}
          onRequestCorrection={() => {}}
        />
      )}
    </div>
  );
};

export default ReviewsList;