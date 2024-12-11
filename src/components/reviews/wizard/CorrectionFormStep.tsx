import React, { useState } from 'react';
import { Project } from '../../../types/project';
import { FormField } from '../../../types/form';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface CorrectionFormStepProps {
  project: Project;
  observations: string;
  onFieldsChange: (fields: string[]) => void;
  onDocumentsChange: (documents: string[]) => void;
  onAdditionalFieldsChange: (fields: FormField[]) => void;
  onAdditionalDocumentsChange: (documents: string[]) => void;
}

const CorrectionFormStep: React.FC<CorrectionFormStepProps> = ({
  project,
  observations,
  onFieldsChange,
  onDocumentsChange,
  onAdditionalFieldsChange,
  onAdditionalDocumentsChange,
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [additionalFields, setAdditionalFields] = useState<FormField[]>([]);
  const [additionalDocuments, setAdditionalDocuments] = useState<string[]>([]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => {
      const newFields = prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId];
      onFieldsChange(newFields);
      return newFields;
    });
  };

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev => {
      const newDocs = prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId];
      onDocumentsChange(newDocs);
      return newDocs;
    });
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

      {/* Form Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Campos a subsanar</h3>
        <div className="space-y-4">
          {project.category?.formFields?.map((field: FormField) => (
            <div key={field.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`field-${field.id}`}
                checked={selectedFields.includes(field.id)}
                onChange={() => handleFieldToggle(field.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`field-${field.id}`} className="text-sm text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos a subsanar</h3>
        <div className="space-y-4">
          {project.documents?.map(doc => (
            <div key={doc.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`doc-${doc.id}`}
                checked={selectedDocuments.includes(doc.id)}
                onChange={() => handleDocumentToggle(doc.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`doc-${doc.id}`} className="text-sm text-gray-700">
                {doc.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="text-blue-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Resumen de subsanación</h4>
            <p className="mt-1 text-sm text-blue-700">
              Se han seleccionado {selectedFields.length} campos y {selectedDocuments.length} documentos para subsanar.
              {additionalFields.length > 0 && ` Se requieren ${additionalFields.length} campos adicionales.`}
              {additionalDocuments.length > 0 && ` Se requieren ${additionalDocuments.length} documentos adicionales.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionFormStep;