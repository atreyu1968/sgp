import React from 'react';
import { FileText, Building2, Calendar, User, Phone, Mail, ExternalLink } from 'lucide-react';
import { Project } from '../../../types/project';

interface ProjectDetailsStepProps {
  project: Project;
  onOpenDocument: (url: string) => void;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  project,
  onOpenDocument,
}) => {
  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Título</p>
            <p className="mt-1 text-base text-gray-900">{project.title}</p>
          </div>

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
              <Building2 className="mr-2 text-gray-400" size={20} />
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

          <div>
            <p className="text-sm font-medium text-gray-500">Importe solicitado</p>
            <div className="mt-1 flex items-center text-base text-gray-900">
              <span className="font-semibold">{project.requestedAmount?.toLocaleString('es-ES')}€</span>
              {project.category?.totalBudget && (
                <span className="ml-2 text-sm text-gray-500">
                  (Máx. {project.category.totalBudget.toLocaleString('es-ES')}€)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">Descripción</p>
          <p className="mt-1 text-base text-gray-900">{project.description}</p>
        </div>
      </div>

      {/* Responsible Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Responsable del Proyecto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Nombre completo</p>
            <div className="mt-1 flex items-center text-base text-gray-900">
              <User className="mr-2 text-gray-400" size={20} />
              {project.mainResponsible?.name}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">DNI/NIE</p>
            <div className="mt-1 flex items-center text-base text-gray-900">
              <User className="mr-2 text-gray-400" size={20} />
              {project.mainResponsible?.dni}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Teléfono</p>
            <div className="mt-1 flex items-center text-base text-gray-900">
              <Phone className="mr-2 text-gray-400" size={20} />
              {project.mainResponsible?.phone}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Especialidad</p>
            <div className="mt-1 flex items-center text-base text-gray-900">
              <Mail className="mr-2 text-gray-400" size={20} />
              {project.mainResponsible?.specialty}
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos del Proyecto</h3>
        
        <div className="space-y-4">
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
              <button
                onClick={() => onOpenDocument(doc.url)}
                className="text-blue-600 hover:text-blue-700"
              >
                <ExternalLink size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsStep;