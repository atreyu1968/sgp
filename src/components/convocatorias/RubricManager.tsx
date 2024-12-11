import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { RubricSection, RubricCriterion, RubricLevel } from '../../types/convocatoria';
import { useConvocatorias } from '../../context/ConvocatoriasContext';

interface RubricManagerProps {
  convocatoriaId: string;
  categoryId: string;
  initialSections?: RubricSection[];
  onClose: () => void;
}

const RubricManager: React.FC<RubricManagerProps> = ({
  convocatoriaId,
  categoryId,
  initialSections = [],
  onClose,
}) => {
  const { updateRubric } = useConvocatorias();
  const [sections, setSections] = useState<RubricSection[]>(initialSections);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const addSection = () => {
    const newSection: RubricSection = {
      id: `s${Date.now()}`,
      name: '',
      description: '',
      weight: 100 / (sections.length + 1),
      criteria: []
    };
    setSections([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const updateSection = (sectionId: string, updates: Partial<RubricSection>) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const addCriterion = (sectionId: string) => {
    const newCriterion: RubricCriterion = {
      id: `c${Date.now()}`,
      name: '',
      description: '',
      maxScore: 10,
      sectionId,
      levels: [
        { id: 'l1', score: 10, description: 'Excelente' },
        { id: 'l2', score: 7, description: 'Bueno' },
        { id: 'l3', score: 4, description: 'Regular' },
        { id: 'l4', score: 1, description: 'Insuficiente' }
      ]
    };

    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, criteria: [...section.criteria, newCriterion] }
        : section
    ));
  };

  const updateCriterion = (
    sectionId: string,
    criterionId: string,
    updates: Partial<RubricCriterion>
  ) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            criteria: section.criteria.map(criterion =>
              criterion.id === criterionId
                ? { ...criterion, ...updates }
                : criterion
            )
          }
        : section
    ));
  };

  const removeCriterion = (sectionId: string, criterionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            criteria: section.criteria.filter(c => c.id !== criterionId)
          }
        : section
    ));
  };

  const updateLevel = (
    sectionId: string,
    criterionId: string,
    levelId: string,
    updates: Partial<RubricLevel>
  ) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            criteria: section.criteria.map(criterion =>
              criterion.id === criterionId
                ? {
                    ...criterion,
                    levels: criterion.levels.map(level =>
                      level.id === levelId
                        ? { ...level, ...updates }
                        : level
                    )
                  }
                : criterion
            )
          }
        : section
    ));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleSave = () => {
    updateRubric(convocatoriaId, categoryId, sections);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Rúbrica de Evaluación</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedSections.has(section.id) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => updateSection(section.id, { name: e.target.value })}
                          className="flex-1 text-lg font-medium bg-transparent border-none focus:ring-0"
                          placeholder="Título de la sección"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Peso:</span>
                          <input
                            type="number"
                            value={section.weight}
                            onChange={(e) => updateSection(section.id, { weight: parseInt(e.target.value) })}
                            className="w-20 text-sm rounded-md border-gray-300"
                            min="0"
                            max="100"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={section.description || ''}
                        onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        className="w-full text-sm bg-transparent border-none focus:ring-0"
                        placeholder="Descripción de la sección"
                      />
                    </div>
                  </div>
                </div>

                {expandedSections.has(section.id) && (
                  <div className="p-4 space-y-4">
                    {section.criteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="border border-gray-200 rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={criterion.name}
                              onChange={(e) =>
                                updateCriterion(section.id, criterion.id, { name: e.target.value })
                              }
                              className="block w-full text-sm font-medium border-none bg-transparent focus:ring-0"
                              placeholder="Nombre del criterio"
                            />
                            <input
                              type="text"
                              value={criterion.description}
                              onChange={(e) =>
                                updateCriterion(section.id, criterion.id, { description: e.target.value })
                              }
                              className="block w-full text-sm border-none bg-transparent focus:ring-0"
                              placeholder="Descripción del criterio"
                            />
                          </div>
                          <button
                            onClick={() => removeCriterion(section.id, criterion.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Niveles de evaluación
                          </h4>
                          {criterion.levels.map((level) => (
                            <div
                              key={level.id}
                              className="flex items-center space-x-4"
                            >
                              <input
                                type="number"
                                value={level.score}
                                onChange={(e) =>
                                  updateLevel(section.id, criterion.id, level.id, {
                                    score: parseInt(e.target.value)
                                  })
                                }
                                className="w-20 text-sm rounded-md border-gray-300"
                                min="0"
                                max={criterion.maxScore}
                              />
                              <input
                                type="text"
                                value={level.description}
                                onChange={(e) =>
                                  updateLevel(section.id, criterion.id, level.id, {
                                    description: e.target.value
                                  })
                                }
                                className="flex-1 text-sm rounded-md border-gray-300"
                                placeholder="Descripción del nivel"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addCriterion(section.id)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus size={20} className="inline-block mr-2" />
                      Añadir criterio
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="space-y-4 pt-4">
              <button
                type="button"
                onClick={addSection}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={20} className="inline-block mr-2" />
                Añadir sección
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Guardar rúbrica
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubricManager;