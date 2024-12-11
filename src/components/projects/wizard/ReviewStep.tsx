import React from 'react';
import { FileText, Calendar, Building2, Folder } from 'lucide-react';
import { Project } from '../../../types/project';

interface ReviewStepProps {
  data: Partial<Project>;
  convocatoria: any;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, convocatoria }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información del Proyecto
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Título</h4>
            <p className="mt-1 text-base text-gray-900">{data.title}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
            <p className="mt-1 text-base text-gray-900">{data.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Categoría</h4>
              <div className="mt-1 flex items-center text-base text-gray-900">
                <Folder className="mr-2 text-gray-400" size={20} />
                {data.category?.name}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Centro</h4>
              <div className="mt-1 flex items-center text-base text-gray-900">
                <Building2 className="mr-2 text-gray-400" size={20} />
                {data.center}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Departamento</h4>
              <div className="mt-1 flex items-center text-base text-gray-900">
                <Building2 className="mr-2 text-gray-400" size={20} />
                {data.department}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Documentación
        </h3>

        <div className="space-y-4">
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
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Plazos Importantes
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Plazo de presentación
                </p>
                <p className="text-xs text-gray-500">
                  Hasta el {new Date(convocatoria.phases.submission.end).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Plazo de subsanaciones
                </p>
                <p className="text-xs text-gray-500">
                  Del {new Date(convocatoria.phases.corrections.start).toLocaleDateString('es-ES')} al{' '}
                  {new Date(convocatoria.phases.corrections.end).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Al presentar el proyecto, confirmas que toda la información proporcionada es correcta
          y que has leído y aceptas las bases de la convocatoria.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;