import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Save } from 'lucide-react';
import { FormField } from '../../../types/form';
import { v4 as uuidv4 } from 'uuid';
import FieldEditorModal from '../FieldEditorModal';
import FormFieldComponent from './FormField';
import { predefinedFields } from './predefinedFields';

interface FormBuilderProps {
  fields: FormField[];
  onSave: (fields: FormField[], isDraft?: boolean) => void;
  onCancel: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onSave,
  onCancel,
}) => {
  const [formFields, setFormFields] = useState<FormField[]>(
    fields.length > 0 ? fields : predefinedFields.map(field => ({ ...field, id: uuidv4() }))
  );
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormFields(items);
    setIsDirty(true);
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      const newFields = formFields.map(f => 
        f.id === field.id ? field : f
      );
      setFormFields(newFields);
    } else {
      const newFields = [...formFields, field];
      setFormFields(newFields);
    }
    setShowFieldModal(false);
    setEditingField(undefined);
    setIsDirty(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setShowFieldModal(true);
  };

  const removeField = (id: string) => {
    const newFields = formFields.filter(field => field.id !== id);
    setFormFields(newFields);
    setIsDirty(true);
  };

  const handleSave = (asDraft: boolean = false) => {
    onSave(formFields, asDraft);
  };

  const handleClose = () => {
    if (isDirty) {
      if (confirm('¿Deseas guardar los cambios como borrador antes de salir?')) {
        handleSave(true);
      } else if (confirm('¿Estás seguro de que deseas salir sin guardar los cambios?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {formFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <FormFieldComponent
                        field={field}
                        onEdit={() => handleEditField(field)}
                        onRemove={() => removeField(field.id)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={() => setShowFieldModal(true)}
        className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
      >
        <Plus size={20} className="mr-2" />
        Añadir campo
      </button>

      <div className="flex justify-end space-x-4">
        <button 
          onClick={handleClose}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => handleSave(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Guardar como borrador</span>
          </button>
          <button
            onClick={() => handleSave(false)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Guardar configuración</span>
          </button>
        </div>
      </div>

      {showFieldModal && (
        <FieldEditorModal
          field={editingField}
          onSave={handleSaveField}
          onClose={() => {
            setShowFieldModal(false);
            setEditingField(undefined);
          }}
        />
      )}
    </div>
  );
};

export default FormBuilder;