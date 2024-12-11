import React, { useRef } from 'react';
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react';
import { Project } from '../../../types/project';

interface DocumentsStepProps {
  data: Partial<Project>;
  category: any;
  onChange: (documents: any[]) => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  data,
  category,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo no debe superar los 10MB');
        return;
      }

      const newDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString(),
        status: 'pending',
      };

      onChange([...(data.documents || []), newDocument]);
    });
  };

  const removeDocument = (documentId: string) => {
    onChange((data.documents || []).filter(doc => doc.id !== documentId));
  };

  const getRequirementStatus = (requirement: string) => {
    const hasDocument = (data.documents || []).some(
      doc => doc.type === requirement
    );
    return hasDocument;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Documentos requeridos:
        </h3>
        <div className="space-y-2">
          {category?.requirements.map((req: string) => (
            <div
              key={req}
              className="flex items-center justify-between bg-white p-3 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-gray-400" />
                <span className="text-sm text-gray-700">{req}</span>
              </div>
              {getRequirementStatus(req) ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <AlertCircle size={20} className="text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          multiple
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="mr-2" size={20} />
          Subir documentos
        </button>
        <p className="mt-1 text-xs text-gray-500">
          PDF, Word o PowerPoint. Máximo 10MB por archivo.
        </p>
      </div>

      {(data.documents || []).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">
            Documentos subidos:
          </h3>
          {data.documents?.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    Subido el {new Date(doc.uploadDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeDocument(doc.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsStep;