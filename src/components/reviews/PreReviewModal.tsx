import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, FileText, ExternalLink } from 'lucide-react';
import { Project } from '../../types/project';

interface PreReviewModalProps {
  project: Project;
  onClose: () => void;
  onRequestCorrection: (observations: string) => void;
  onApproveForReview: () => void;
}

const PreReviewModal: React.FC<PreReviewModalProps> = ({
  project,
  onClose,
  onRequestCorrection,
  onApproveForReview,
}) => {
  const [observations, setObservations] = useState('');
  const [decision, setDecision] = useState<'pending' | 'correction' | 'approve'>('pending');

  const handleSubmit = () => {
    if (decision === 'correction') {
      onRequestCorrection(observations);
    } else {
      onApproveForReview();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Precorrección del Proyecto</h2>
            <p className="mt-1 text-sm text-gray-500">{project.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Project Documents */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos del proyecto</h3>
            <div className="space-y-2">
              {project.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        Subido el {new Date(doc.uploadDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Decisión de precorrección</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setDecision('correction')}
                className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${
                  decision === 'correction'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <AlertCircle className={`${
                  decision === 'correction' ? 'text-red-500' : 'text-gray-400'
                }`} size={24} />
                <div className="text-left">
                  <p className="font-medium">Requiere subsanación</p>
                  <p className="text-sm text-gray-500">
                    El proyecto necesita documentación o correcciones adicionales
                  </p>
                </div>
              </button>

              <button
                onClick={() => setDecision('approve')}
                className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${
                  decision === 'approve'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <CheckCircle className={`${
                  decision === 'approve' ? 'text-green-500' : 'text-gray-400'
                }`} size={24} />
                <div className="text-left">
                  <p className="font-medium">Apto para corrección</p>
                  <p className="text-sm text-gray-500">
                    El proyecto cumple con los requisitos para ser evaluado
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Observations */}
          {decision === 'correction' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Observaciones para la subsanación
              </h3>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe los aspectos que necesitan ser subsanados..."
                required
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={decision === 'pending' || (decision === 'correction' && !observations)}
            className={`btn ${
              decision === 'approve' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {decision === 'approve' ? 'Aprobar para corrección' : 'Solicitar subsanación'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreReviewModal;