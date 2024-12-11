import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { RubricSection, RubricCriterion, RubricLevel } from '../../types/convocatoria';
import RubricPreview from './RubricPreview';

interface RubricFormProps {
  criteria: RubricCriterion[];
  onUpdate: (criteria: RubricCriterion[]) => void;
  onClose: () => void;
}

const RubricForm: React.FC<RubricFormProps> = ({ criteria, onUpdate, onClose }) => {
  const [sections, setSections] = useState<RubricSection[]>(() => {
    if (criteria.length > 0) {
      const sectionMap = criteria.reduce((acc, criterion) => {
        const section = acc.get(criterion.sectionId) || {
          id: criterion.sectionId,
          name: '',
          description: '',
          criteria: [],
          weight: 100
        };
        section.criteria.push(criterion);
        acc.set(criterion.sectionId, section);
        return acc;
      }, new Map<string, RubricSection>());

      return Array.from(sectionMap.values());
    }
    return [];
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const addSection = () => {
    const newSection: RubricSection = {
      id: Date.now().toString(),
      name: '',
      description: '',
      criteria: [],
      weight: 100
    };
    setSections([...sections, newSection]);
    setExpandedSections((prev) => new Set([...prev, newSection.id]));
  };

  const updateSection = (sectionId: string, field: string, value: string | number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const addCriterion = (sectionId: string) => {
    const newCriterion: RubricCriterion = {
      id: Date.now().toString(),
      name: '',
      description: '',
      maxScore: 10,
      sectionId,
      levels: [
        { id: '1', score: 10, description: 'Excelente' },
        { id: '2', score: 7, description: 'Bueno' },
        { id: '3', score: 4, description: 'Regular' },
        { id: '4', score: 1, description: 'Insuficiente' }
      ]
    };

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, criteria: [...section.criteria, newCriterion] }
          : section
      )
    );
  };

  const updateCriterion = (
    sectionId: string,
    criterionId: string,
    field: string,
    value: string | number
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              criteria: section.criteria.map((criterion) =>
                criterion.id === criterionId
                  ? { ...criterion, [field]: value }
                  : criterion
              )
            }
          : section
      )
    );
  };

  const removeCriterion = (sectionId: string, criterionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              criteria: section.criteria.filter((c) => c.id !== criterionId)
            }
          : section
      )
    );
  };

  const updateLevel = (
    sectionId: string,
    criterionId: string,
    levelId: string,
    field: string,
    value: string | number
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              criteria: section.criteria.map((criterion) =>
                criterion.id === criterionId
                  ? {
                      ...criterion,
                      levels: criterion.levels.map((level) =>
                        level.id === levelId
                          ? { ...level, [field]: value }
                          : level
                      )
                    }
                  : criterion
              )
            }
          : section
      )
    );
  };

  const handleSave = () => {
    const allCriteria = sections.flatMap((section) =>
      section.criteria.map((criterion) => ({
        ...criterion,
        sectionId: section.id
      }))
    );
    onUpdate(allCriteria);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Rúbrica de Evaluación</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Eye size={20} className="mr-2" />
              {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
        </div>

        {showPreview ? (
          <RubricPreview
            sections={sections}
            onClose={() => setShowPreview(false)}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {sections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No hay secciones definidas</p>
                    <button
                      type="button"
                      onClick={addSection}
                      className="btn btn-primary flex items-center space-x-2 mx-auto"
                    >
                      <Plus size={20} />
                      <span>Añadir primera sección</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
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
                                  onChange={(e) =>
                                    updateSection(section.id, 'name', e.target.value)
                                  }
                                  className="flex-1 text-lg font-medium bg-transparent border-none focus:ring-0"
                                  placeholder="Título de la sección"
                                />
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">Peso:</span>
                                  <input
                                    type="number"
                                    value={section.weight}
                                    onChange={(e) =>
                                      updateSection(section.id, 'weight', parseInt(e.target.value))
                                    }
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
                                onChange={(e) =>
                                  updateSection(section.id, 'description', e.target.value)
                                }
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
                                        updateCriterion(
                                          section.id,
                                          criterion.id,
                                          'name',
                                          e.target.value
                                        )
                                      }
                                      className="block w-full text-sm font-medium border-none bg-transparent focus:ring-0"
                                      placeholder="Nombre del criterio"
                                    />
                                    <input
                                      type="text"
                                      value={criterion.description}
                                      onChange={(e) =>
                                        updateCriterion(
                                          section.id,
                                          criterion.id,
                                          'description',
                                          e.target.value
                                        )
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
                                          updateLevel(
                                            section.id,
                                            criterion.id,
                                            level.id,
                                            'score',
                                            parseInt(e.target.value)
                                          )
                                        }
                                        className="w-20 text-sm rounded-md border-gray-300"
                                        min="0"
                                        max={criterion.maxScore}
                                      />
                                      <input
                                        type="text"
                                        value={level.description}
                                        onChange={(e) =>
                                          updateLevel(
                                            section.id,
                                            criterion.id,
                                            level.id,
                                            'description',
                                            e.target.value
                                          )
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
                  </>
                )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default RubricForm;