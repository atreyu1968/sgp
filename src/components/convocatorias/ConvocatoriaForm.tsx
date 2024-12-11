import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Convocatoria, Category } from '../../types/convocatoria';
import CategoryForm from './CategoryForm';
import { useCategories } from '../../context/CategoriesContext';

interface ConvocatoriaFormProps {
  initialData?: Partial<Convocatoria>;
  onSubmit: (data: Partial<Convocatoria>) => void;
  onCancel: () => void;
}

const ConvocatoriaForm: React.FC<ConvocatoriaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState<Partial<Convocatoria>>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    status: 'draft',
    phases: {
      submission: { start: '', end: '' },
      firstReview: { start: '', end: '' },
      corrections: { start: '', end: '' },
      resultsPublication: '',
    },
    categories: [],
    ...initialData,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhaseChange = (phase: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      phases: {
        ...prev.phases!,
        [phase]: field === 'date' ? value : {
          ...prev.phases![phase as keyof typeof prev.phases],
          [field]: value
        }
      }
    }));
  };

  const addCategory = () => {
    const newCategory: Partial<Category> = {
      id: Date.now().toString(),
      name: '',
      description: '',
      maxParticipants: 4,
      minCorrections: 2,
      requirements: [],
      cutoffScore: 5,
      totalBudget: 0,
    };

    setFormData((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), newCategory as Category],
    }));
  };

  const updateCategory = (index: number, updatedCategory: Partial<Category>) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.map((cat, i) =>
        i === index ? { ...cat, ...updatedCategory } : cat
      ),
    }));
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Año *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="draft">Borrador</option>
              <option value="active">Activa</option>
              <option value="closed">Cerrada</option>
              <option value="archived">Archivada</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Plazos *</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Presentación de proyectos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Fecha inicio</label>
                  <input
                    type="date"
                    value={formData.phases?.submission.start}
                    onChange={(e) => handlePhaseChange('submission', 'start', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Fecha fin</label>
                  <input
                    type="date"
                    value={formData.phases?.submission.end}
                    onChange={(e) => handlePhaseChange('submission', 'end', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Primera revisión</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Fecha inicio</label>
                  <input
                    type="date"
                    value={formData.phases?.firstReview.start}
                    onChange={(e) => handlePhaseChange('firstReview', 'start', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Fecha fin</label>
                  <input
                    type="date"
                    value={formData.phases?.firstReview.end}
                    onChange={(e) => handlePhaseChange('firstReview', 'end', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Subsanaciones</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Fecha inicio</label>
                  <input
                    type="date"
                    value={formData.phases?.corrections.start}
                    onChange={(e) => handlePhaseChange('corrections', 'start', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Fecha fin</label>
                  <input
                    type="date"
                    value={formData.phases?.corrections.end}
                    onChange={(e) => handlePhaseChange('corrections', 'end', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Publicación de resultados</h4>
              <input
                type="date"
                value={formData.phases?.resultsPublication}
                onChange={(e) => handlePhaseChange('resultsPublication', 'date', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Categorías *</h3>
          <button
            type="button"
            onClick={addCategory}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Añadir categoría</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.categories?.map((category, index) => (
            <CategoryForm
              key={category.id}
              convocatoriaId={formData.id || ''}
              category={category}
              onUpdate={(updatedCategory) => updateCategory(index, updatedCategory)}
              onRemove={() => removeCategory(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {initialData ? 'Actualizar Convocatoria' : 'Crear Convocatoria'}
        </button>
      </div>
    </form>
  );
};

export default ConvocatoriaForm;