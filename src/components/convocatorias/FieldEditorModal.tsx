import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FormField, FieldType } from '../../types/form';
import { v4 as uuidv4 } from 'uuid';

interface FieldEditorModalProps {
  field?: FormField;
  onSave: (field: FormField) => void;
  onClose: () => void;
}

const FieldEditorModal: React.FC<FieldEditorModalProps> = ({
  field,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<FormField>(field || {
    id: uuidv4(),
    type: 'text',
    label: '',
    required: false,
    placeholder: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {field ? 'Editar Campo' : 'Nuevo Campo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de campo
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="text">Texto</option>
              <option value="textarea">Área de texto</option>
              <option value="number">Número</option>
              <option value="select">Selector</option>
              <option value="file">Archivo</option>
              <option value="date">Fecha</option>
              <option value="tel">Teléfono</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Etiqueta
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Placeholder
            </label>
            <input
              type="text"
              name="placeholder"
              value={formData.placeholder || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {formData.type === 'select' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opciones (una por línea)
              </label>
              <textarea
                name="options"
                value={formData.options?.join('\n') || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  options: e.target.value.split('\n').filter(Boolean)
                }))}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          {(formData.type === 'text' || formData.type === 'textarea') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitud máxima
              </label>
              <input
                type="number"
                name="maxLength"
                value={formData.maxLength || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          {formData.type === 'number' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor mínimo
                </label>
                <input
                  type="number"
                  name="minValue"
                  value={formData.minValue || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor máximo
                </label>
                <input
                  type="number"
                  name="maxValue"
                  value={formData.maxValue || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </>
          )}

          {formData.type === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipos de archivo permitidos
              </label>
              <input
                type="text"
                name="acceptedFileTypes"
                value={formData.acceptedFileTypes?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  acceptedFileTypes: e.target.value.split(',').map(t => t.trim())
                }))}
                placeholder=".pdf, .doc, .docx"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="required"
              checked={formData.required}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Campo obligatorio
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Guardar campo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldEditorModal;