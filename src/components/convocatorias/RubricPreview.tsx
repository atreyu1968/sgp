import React, { useState } from 'react';
import { RubricSection } from '../../types/convocatoria';

interface RubricPreviewProps {
  sections: RubricSection[];
  onClose: () => void;
}

const RubricPreview: React.FC<RubricPreviewProps> = ({ sections, onClose }) => {
  const [selectedScores, setSelectedScores] = useState<Record<string, number>>({});
  const totalWeight = sections.reduce((sum, section) => sum + section.weight, 0);

  const handleScoreSelect = (criterionId: string, score: number) => {
    setSelectedScores(prev => ({
      ...prev,
      [criterionId]: score
    }));
  };

  const calculateSectionScore = (section: RubricSection) => {
    const sectionMaxScore = section.criteria.reduce((sum, c) => sum + c.maxScore, 0);
    const sectionCurrentScore = section.criteria.reduce((sum, c) => sum + (selectedScores[c.id] || 0), 0);
    return (sectionCurrentScore / sectionMaxScore) * section.weight;
  };

  const totalScore = sections.reduce((sum, section) => sum + calculateSectionScore(section), 0);
  const normalizedTotalScore = (totalScore / totalWeight) * 10;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gray-50 p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                <span className="text-sm text-gray-500">Peso: {section.weight}%</span>
              </div>
              {section.description && (
                <p className="mt-1 text-sm text-gray-600">{section.description}</p>
              )}
            </div>

            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criterio
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntuación
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción del nivel
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {section.criteria.map((criterion) => (
                    <tr key={criterion.id}>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {criterion.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {criterion.description}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={selectedScores[criterion.id] || ''}
                          onChange={(e) => handleScoreSelect(criterion.id, Number(e.target.value))}
                          className="block w-full rounded-md border-gray-300 text-sm"
                        >
                          <option value="">Seleccionar</option>
                          {criterion.levels.map((level) => (
                            <option key={level.id} value={level.score}>
                              {level.score} puntos
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        {selectedScores[criterion.id] !== undefined && (
                          <div className="text-sm text-gray-900">
                            {criterion.levels.find(
                              (l) => l.score === selectedScores[criterion.id]
                            )?.description}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Puntuación de la sección
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {calculateSectionScore(section).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Puntuación Total
            </h3>
            <div className="text-2xl font-bold text-blue-600">
              {normalizedTotalScore.toFixed(2)}/10
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="btn btn-primary">
          Volver a la edición
        </button>
      </div>
    </div>
  );
};

export default RubricPreview;