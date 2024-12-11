import React, { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Category } from '../../types/convocatoria';
import RubricManager from './RubricManager';
import ProjectFormConfig from './ProjectFormConfig';

interface CategoryFormProps {
  convocatoriaId: string;
  category: Partial<Category>;
  onUpdate: (category: Partial<Category>) => void;
  onRemove: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  convocatoriaId,
  category,
  onUpdate,
  onRemove,
}) => {
  const [showRubricManager, setShowRubricManager] = useState(false);
  const [showFormConfig, setShowFormConfig] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ 
      ...category, 
      [name]: name === 'cutoffScore' || name === 'totalBudget' || name === 'maxParticipants' || name === 'minCorrections' ? 
        Number(value) : value 
    });
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const requirements = e.target.value.split('\n').filter(req => req.trim());
    onUpdate({ ...category, requirements });
  };

  const handleFormConfigUpdate = (fields: FormField[], isDraft?: boolean) => {
    onUpdate({ 
      ...category, 
      formFields: fields,
      status: isDraft ? 'draft' : 'active'
    });
    setShowFormConfig(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría *
            </label>
            <input
              type="text"
              name="name"
              value={category.name}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de participantes *
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={category.maxParticipants}
              onChange={handleInputChange}
              min="1"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mínimo de correcciones *
            </label>
            <input
              type="number"
              name="minCorrections"
              value={category.minCorrections}
              onChange={handleInputChange}
              min="1"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota de corte *
            </label>
            <input
              type="number"
              name="cutoffScore"
              value={category.cutoffScore}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presupuesto total (€) *
            </label>
            <input
              type="number"
              name="totalBudget"
              value={category.totalBudget}
              onChange={handleInputChange}
              min="0"
              step="100"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          onClick={onRemove}
          className="ml-4 text-gray-400 hover:text-red-500"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          name="description"
          value={category.description}
          onChange={handleInputChange}
          rows={2}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requisitos (uno por línea) *
        </label>
        <textarea
          value={category.requirements?.join('\n')}
          onChange={handleRequirementsChange}
          rows={3}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Memoria técnica&#10;Presupuesto&#10;Video demostrativo"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setShowFormConfig(true)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Settings size={20} />
          <span>Configurar formulario</span>
        </button>
        <button
          type="button"
          onClick={() => setShowRubricManager(true)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Settings size={20} />
          <span>Configurar rúbrica</span>
        </button>
      </div>

      {showRubricManager && category.id && (
        <RubricManager
          convocatoriaId={convocatoriaId}
          categoryId={category.id}
          initialSections={category.rubric?.sections}
          onClose={() => setShowRubricManager(false)}
        />
      )}

      {showFormConfig && category.id && (
        <ProjectFormConfig
          categoryId={category.id}
          fields={category.formFields || []}
          onUpdate={handleFormConfigUpdate}
          onCancel={() => setShowFormConfig(false)}
        />
      )}
    </div>
  );
};

export default CategoryForm;