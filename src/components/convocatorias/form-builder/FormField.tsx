import React from 'react';
import { FormField } from '../../../types/form';
import { Edit, Trash2, GripVertical } from 'lucide-react';

interface FormFieldProps {
  field: FormField;
  onEdit: () => void;
  onRemove: () => void;
  dragHandleProps: any;
}

const FormFieldComponent: React.FC<FormFieldProps> = ({
  field,
  onEdit,
  onRemove,
  dragHandleProps
}) => {
  return (
    <div className="flex items-center space-x-2 bg-white p-4 rounded-lg border border-gray-200">
      <div {...dragHandleProps}>
        <GripVertical className="text-gray-400" size={20} />
      </div>
      <div className="flex-1">
        <p className="font-medium">{field.label}</p>
        <p className="text-sm text-gray-500">
          {field.type} {field.required && '(Obligatorio)'}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="Editar campo"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={onRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          title="Eliminar campo"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default FormFieldComponent;