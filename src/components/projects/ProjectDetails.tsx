import React from 'react';
import { X, FileText, Building2, Calendar, Star, Users } from 'lucide-react';
import { Project } from '../../types/project';

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalles del Proyecto</h2>
            <p className="mt-1 text-sm text-gray-500">{project.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Categoría</p>
                  <p className="mt-1 text-base text-gray-900">{project.category?.name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <span className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    project.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' :
                    project.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.status === 'draft' ? 'Borrador' :
                     project.status === 'submitted' ? 'Presentado' :
                     project.status === 'reviewing' ? 'En revisión' :
                     project.status === 'approved' ? 'Aprobado' :
                     'Rechazado'}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Centro</p>
                  <div className="mt-1 flex items-center text-base text-gray-900">
                    <Building2 className="mr-2 text-gray-400" size={20} />
                    {project.center}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Departamento</p>
                  <div className="mt-1 flex items-center text-base text-gray-900">
                    <Users className="mr-2 text-gray-400" size={20} />
                    {project.department}
                  </div>
                </div>

                {project.submissionDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de presentación</p>
                    <div className="mt-1 flex items-center text-base text-gray-900">
                      <Calendar className="mr-2 text-gray-400" size={20} />
                      {new Date(project.submissionDate).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                )}

                {project.score !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Puntuación</p>
                    <div className="mt-1 flex items-center text-base text-gray-900">
                      <Star className="mr-2 text-gray-400" size={20} />
                      {project.score.toFixed(2)}/10
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            {project.documents && project.documents.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
                <div className="space-y-4">
                  {project.documents.map((doc) => (
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
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {doc.status === 'approved' ? 'Aprobado' :
                         doc.status === 'rejected' ? 'Rechazado' :
                         'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full btn btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;