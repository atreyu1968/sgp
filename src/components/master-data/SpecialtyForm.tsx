import React, { useState } from 'react';
import { Specialty } from '../../types/master';

interface SpecialtyFormProps {
  specialty?: Specialty;
  onSubmit: (data: Partial<Specialty>) => void;
  onCancel: () => void;
}

const SpecialtyForm: React.FC<SpecialtyFormProps> = ({
  specialty,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Specialty>>({
    code: specialty?.code || '',
    name: specialty?.name || '',
    familyId: specialty?.familyId || '',
    description: specialty?.description || '',
    active: specialty?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Familia Profesional
          </label>
          <select
            value={formData.familyId}
            onChange={(e) => setFormData({ ...formData, familyId: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Seleccionar familia</option>
            {/* TODO: Add family options from context */}
            <option value="1">Informática y Comunicaciones</option>
            <option value="2">Electricidad y Electrónica</option>
            <option value="3">Fabricación Mecánica</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            value={formData.active ? 'active' : 'inactive'}
            onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
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
          {specialty ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default SpecialtyForm;