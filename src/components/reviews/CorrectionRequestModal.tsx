import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Project } from '../../types/project';

interface CorrectionRequestModalProps {
  project: Project;
  observations: string;
  onClose: () => void;
  onSubmit: (files: File[]) => Promise<void>;
}

const CorrectionRequestModal: React.FC<CorrectionRequestModalProps> = ({
  project,
  observations,
  onClose,
  onSubmit,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(files);
      onClose();
    } catch (error) {
      console.error('Error submitting corrections:', error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Subsanación del Proyecto</h2>
            <p className="mt-1 text-sm text-gray-500">{project.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Observations */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Observaciones del corrector
            </h3>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 whitespace-pre-wrap">{observations}</p>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Documentación subsanada
            </h3>
            
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              <label className="block">
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 cursor-pointer">
                  <Upload className="mr-2" size={20} />
                  Subir documentos
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar subsanación'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorrectionRequestModal;