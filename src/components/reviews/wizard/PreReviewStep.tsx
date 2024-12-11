import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface PreReviewStepProps {
  decision: 'pending' | 'correction' | 'approve' | 'reject';
  observations: string;
  onDecisionChange: (decision: 'pending' | 'correction' | 'approve' | 'reject') => void;
  onObservationsChange: (observations: string) => void;
}

const PreReviewStep: React.FC<PreReviewStepProps> = ({
  decision,
  observations,
  onDecisionChange,
  onObservationsChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Decisión de precorrección</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onDecisionChange('correction')}
            className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${
              decision === 'correction'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <AlertCircle className={`${
              decision === 'correction' ? 'text-orange-500' : 'text-gray-400'
            }`} size={24} />
            <div className="text-left">
              <p className="font-medium">Requiere subsanación</p>
              <p className="text-sm text-gray-500">
                El proyecto necesita documentación o correcciones adicionales
              </p>
            </div>
          </button>

          <button
            onClick={() => onDecisionChange('approve')}
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

          <button
            onClick={() => onDecisionChange('reject')}
            className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${
              decision === 'reject'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <XCircle className={`${
              decision === 'reject' ? 'text-red-500' : 'text-gray-400'
            }`} size={24} />
            <div className="text-left">
              <p className="font-medium">Rechazar proyecto</p>
              <p className="text-sm text-gray-500">
                El proyecto no cumple con los requisitos mínimos
              </p>
            </div>
          </button>
        </div>
      </div>

      {(decision === 'correction' || decision === 'reject') && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {decision === 'correction' ? 'Observaciones para la subsanación' : 'Motivo del rechazo'}
          </h3>
          <textarea
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder={decision === 'correction' 
              ? "Describe los aspectos que necesitan ser subsanados..."
              : "Explica los motivos por los que se rechaza el proyecto..."
            }
            required
          />
        </div>
      )}
    </div>
  );
};

export default PreReviewStep;