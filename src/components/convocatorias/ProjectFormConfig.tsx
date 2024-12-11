import React from 'react';
import FormBuilder from './form-builder/FormBuilder';
import { FormField } from '../../types/form';

interface ProjectFormConfigProps {
  categoryId: string;
  fields: FormField[];
  onUpdate: (fields: FormField[], isDraft?: boolean) => void;
  onCancel: () => void;
}

const ProjectFormConfig: React.FC<ProjectFormConfigProps> = ({
  categoryId,
  fields,
  onUpdate,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Configurar Formulario</h2>
          <p className="mt-1 text-sm text-gray-500">
            Arrastra y suelta los campos para reordenarlos. Puedes editar o eliminar campos existentes y añadir nuevos.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <FormBuilder
            fields={fields}
            onSave={onUpdate}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectFormConfig;