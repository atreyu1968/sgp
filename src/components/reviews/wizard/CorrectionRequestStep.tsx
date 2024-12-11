import React, { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { Project } from '../../../types/project';
import { FormField } from '../../../types/form';
import { v4 as uuidv4 } from 'uuid';

interface CorrectionRequestStepProps {
  project: Project;
  observations: string;
  onFieldsChange: (fields: FormField[]) => void;
  onDocumentsChange: (documents: string[]) => void;
}

const CorrectionRequestStep: React.FC<CorrectionRequestStepProps> = ({
  project,
  observations,
  onFieldsChange,
  onDocumentsChange,
}) => {
  const [additionalFields, setAdditionalFields] = useState<FormField[]>([]);
  const [additionalDocuments, setAdditionalDocuments] = useState<string[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');

  const handleAddField = () => {
    if (!newFieldName.trim()) return;

    const newField: FormField = {
      id: uuidv4(),
      type: 'text',
      label: newFieldName.trim(),
      required: true,
      placeholder: `Introduce ${newFieldName.trim().toLowerCase()}`,
    };

    setAdditionalFields(prev => [...prev, newField]);
    onFieldsChange([...additionalFields, newField]);
    setNewFieldName('');
  };

  const handleAddDocument = () => {
    if (!newDocumentName.trim()) return;
    
    const newDoc = newDocumentName.trim();
    setAdditionalDocuments(prev => [...prev, newDoc]);
    onDocumentsChange([...additionalDocuments, newDoc]);
    setNewDocumentName('');
  };

  const handleRemoveField = (id: string) => {
    setAdditionalFields(prev => prev.filter(field => field.id !== id));
    onFieldsChange(additionalFields.filter(field => field.id !== id));
  };

  const handleRemoveDocument = (doc: string) => {
    setAdditionalDocuments(prev => prev.filter(d => d !== doc));
    onDocumentsChange(additionalDocuments.filter(d => d !== doc));
  };

  return (
    <div className="space-y-8">
      {/* Observations Display */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Observaciones del corrector</h4>
            <p className="mt-1 text-sm text-yellow-700 whitespace-pre-wrap">{observations}</p>
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Campos adicionales requeridos</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Nombre del nuevo campo"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleAddField}
            disabled={!newFieldName.trim()}
            className="btn btn-primary"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {additionalFields.map(field => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{field.label}</span>
              <button
                onClick={() => handleRemoveField(field.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Documents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos adicionales requeridos</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newDocumentName}
            onChange={(e) => setNewDocumentName(e.target.value)}
            placeholder="Nombre del nuevo documento"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleAddDocument}
            disabled={!newDocumentName.trim()}
            className="btn btn-primary"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {additionalDocuments.map(doc => (
            <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{doc}</span>
              <button
                onClick={() => handleRemoveDocument(doc)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CorrectionRequestStep;