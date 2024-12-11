import React from 'react';
import { X } from 'lucide-react';
import { Review } from '../../types/review';
import { RubricSection } from '../../types/convocatoria';

interface ReviewDetailProps {
  review: Review;
  rubric: {
    sections: RubricSection[];
    totalScore: number;
  };
  onClose: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
  review,
  rubric,
  onClose,
}) => {
  const calculateSectionScore = (sectionId: string) => {
    const section = rubric.sections.find(s => s.id === sectionId);
    if (!section) return 0;

    const sectionTotal = section.criteria.reduce((sum, criterion) => {
      return sum + (review.scores[criterion.id] || 0);
    }, 0);

    const maxSectionScore = section.criteria.reduce((sum, c) => sum + c.maxScore, 0);
    return (sectionTotal / maxSectionScore) * 10;
  };

  const calculateTotalScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    rubric.sections.forEach(section => {
      const sectionScore = calculateSectionScore(section.id);
      totalScore += sectionScore * (section.weight / 100);
      totalWeight += section.weight;
    });

    return totalScore * (100 / totalWeight);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalle de la Corrección</h2>
            <p className="mt-1 text-sm text-gray-500">
              Corrector: {review.reviewerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {rubric.sections.map(section => (
              <div key={section.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.name}
                    </h3>
                    {section.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {section.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Peso: {section.weight}%</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {calculateSectionScore(section.id).toFixed(2)}/10
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.criteria.map(criterion => (
                    <div key={criterion.id} className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {criterion.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {criterion.description}
                          </p>
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {review.scores[criterion.id] || 0}/{criterion.maxScore}
                        </div>
                      </div>
                      {review.comments[criterion.id] && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          <p className="font-medium mb-1">Comentarios:</p>
                          {review.comments[criterion.id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Observaciones Generales
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {calculateTotalScore().toFixed(2)}/10
                </div>
              </div>
              {review.generalObservations && (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {review.generalObservations}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;