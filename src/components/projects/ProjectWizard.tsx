import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import { Project, ProjectStatus } from '../../types/project';
import BasicInfoStep from './wizard/BasicInfoStep';
import DocumentsStep from './wizard/DocumentsStep';
import ReviewStep from './wizard/ReviewStep';

interface ProjectWizardProps {
  project?: Project;
  convocatoria: any; // TODO: Add proper type
  onClose: () => void;
  onSave: (project: Partial<Project>, status: ProjectStatus) => Promise<void>;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({
  project,
  convocatoria,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || undefined,
    center: project?.center || '',
    department: project?.department || '',
    status: project?.status || 'draft',
    documents: project?.documents || [],
    convocatoriaId: convocatoria.id,
  });

  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    {
      title: 'Información Básica',
      component: BasicInfoStep,
      props: {
        data: formData,
        convocatoria,
        onChange: (data: Partial<Project>) => setFormData({ ...formData, ...data }),
      },
      isValid: () => {
        return !!(
          formData.title &&
          formData.description &&
          formData.category &&
          formData.center &&
          formData.department
        );
      },
    },
    {
      title: 'Documentación',
      component: DocumentsStep,
      props: {
        data: formData,
        category: formData.category,
        onChange: (documents: any[]) => setFormData({ ...formData, documents }),
      },
      isValid: () => {
        if (!formData.category) return false;
        const requiredDocs = formData.category.requirements || [];
        const uploadedDocs = formData.documents || [];
        return requiredDocs.every(req => 
          uploadedDocs.some(doc => doc.type === req)
        );
      },
    },
    {
      title: 'Revisión',
      component: ReviewStep,
      props: {
        data: formData,
        convocatoria,
      },
      isValid: () => true,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async (submit: boolean) => {
    try {
      setIsSaving(true);
      await onSave(formData, submit ? 'submitted' : 'draft');
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setIsSaving(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Paso {currentStep + 1} de {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <CurrentStepComponent {...steps[currentStep].props} />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`btn btn-secondary flex items-center space-x-2 ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving || !steps[currentStep].isValid()}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{isSaving ? 'Guardando...' : 'Guardar borrador'}</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving || !steps[currentStep].isValid()}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Send size={20} />
                <span>{isSaving ? 'Enviando...' : 'Presentar proyecto'}</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!steps[currentStep].isValid()}
                className="btn btn-primary flex items-center space-x-2"
              >
                <span>Siguiente</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;