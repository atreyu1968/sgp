import React from 'react';
import { Project } from '../../../types/project';

interface ReviewFormStepProps {
  project: Project;
  data: any;
  onChange: (data: any) => void;
}

const ReviewFormStep: React.FC<ReviewFormStepProps> = ({
  project,
  data,
  onChange,
}) => {
  const rubric = project.category?.rubric;

  if (!rubric?.sections) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">
          No se encontró la rúbrica de evaluación para esta categoría.
          Por favor, contacte con el administrador.
        </p>
      </div>
    );
  }

  const handleScoreChange = (criterionId: string, score: number) => {
    onChange({
      ...data,
      scores: {
        ...(data.scores || {}),
        [criterionId]: score,
      },
    });
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    onChange({
      ...data,
      comments: {
        ...(data.comments || {}),
        [criterionId]: comment,
      },
    });
  };

  const handleGeneralObservationsChange = (observations: string) => {
    onChange({
      ...data,
      generalObservations: observations,
    });
  };

  return (
    <div className="space-y-8">
      {rubric.sections.map(section => (
        <div key={section.id} className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
            {section.description && (
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            )}
            <p className="mt-2 text-sm text-blue-600">
              Peso en la evaluación: {section.weight}%
            </p>
          </div>

          <div className="space-y-6">
            {section.criteria.map(criterion => (
              <div key={criterion.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="mb-4">
                  <h4 className="text-base font-medium text-gray-900">{criterion.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{criterion.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puntuación
                    </label>
                    <select
                      value={data.scores?.[criterion.id] || ''}
                      onChange={(e) => handleScoreChange(criterion.id, Number(e.target.value))}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar puntuación</option>
                      {criterion.levels.map(level => (
                        <option key={level.id} value={level.score}>
                          {level.score} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentarios
                    </label>
                    <textarea
                      value={data.comments?.[criterion.id] || ''}
                      onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                      rows={3}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Añade comentarios justificativos de la puntuación..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Observaciones Generales
        </h3>
        <textarea
          value={data.generalObservations || ''}
          onChange={(e) => handleGeneralObservationsChange(e.target.value)}
          rows={4}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Añade observaciones generales sobre el proyecto..."
        />
      </div>
    </div>
  );
};

export default ReviewFormStep;