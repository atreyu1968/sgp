import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Project } from '../../types/project';
import { Review } from '../../types/review';

interface ReviewModalProps {
  project: Project;
  initialData?: Review;
  onClose: () => void;
  onSave: (reviewData: any, isDraft: boolean) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  project,
  initialData,
  onClose,
  onSave,
}) => {
  const [scores, setScores] = useState<Record<string, number>>(initialData?.scores || {});
  const [comments, setComments] = useState<Record<string, string>>(initialData?.comments || {});
  const [generalObservations, setGeneralObservations] = useState(initialData?.generalObservations || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get rubric from project category
  const rubric = project.category?.rubric;

  if (!rubric?.sections) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Error</h2>
          </div>
          <div className="p-6">
            <p className="text-red-600">
              No se encontró la rúbrica de evaluación para esta categoría.
              Por favor, contacte con el administrador.
            </p>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button onClick={onClose} className="btn btn-primary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleScoreChange = (criterionId: string, score: number) => {
    setScores(prev => ({ ...prev, [criterionId]: score }));
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    setComments(prev => ({ ...prev, [criterionId]: comment }));
  };

  const handleSave = async (isDraft: boolean) => {
    try {
      setIsSaving(true);
      setError(null);

      const reviewData = {
        projectId: project.id,
        scores,
        comments,
        generalObservations,
        isDraft,
      };

      await onSave(reviewData, isDraft);
      onClose();
    } catch (err) {
      setError('Error al guardar la corrección');
      console.error('Error saving review:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const isComplete = () => {
    return rubric.sections.every(section =>
      section.criteria.every(criterion => scores[criterion.id] !== undefined)
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Editar Corrección' : 'Nueva Corrección'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{project.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

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
                            value={scores[criterion.id] || ''}
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
                            value={comments[criterion.id] || ''}
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
                value={generalObservations}
                onChange={(e) => setGeneralObservations(e.target.value)}
                rows={4}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Añade observaciones generales sobre el proyecto..."
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isSaving}
          >
            Cancelar
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSave(true)}
              className="btn btn-secondary flex items-center space-x-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save size={20} />
              )}
              <span>Guardar borrador</span>
            </button>

            <button
              onClick={() => handleSave(false)}
              className="btn btn-primary flex items-center space-x-2"
              disabled={isSaving || !isComplete()}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save size={20} />
              )}
              <span>Guardar y puntuar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;