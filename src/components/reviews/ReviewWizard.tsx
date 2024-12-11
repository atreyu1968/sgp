import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Project } from '../../types/project';
import ProjectDetailsStep from './wizard/ProjectDetailsStep';
import PreReviewStep from './wizard/PreReviewStep';
import CorrectionFormStep from './wizard/CorrectionFormStep';
import ReviewFormStep from './wizard/ReviewFormStep';

interface ReviewWizardProps {
  project: Project;
  onClose: () => void;
  onSave: (reviewData: any, isDraft: boolean) => Promise<void>;
  onRequestCorrection: (observations: string, fields: string[], documents: string[]) => Promise<void>;
  onReject: (observations: string) => Promise<void>;
}

const ReviewWizard: React.FC<ReviewWizardProps> = ({
  project,
  onClose,
  onSave,
  onRequestCorrection,
  onReject,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    projectReview: {
      isComplete: false,
      decision: 'pending' as 'pending' | 'correction' | 'approve' | 'reject',
      observations: '',
      selectedFields: [] as string[],
      selectedDocuments: [] as string[],
    },
    review: {
      scores: {},
      comments: {},
      generalObservations: '',
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    {
      title: 'Detalles del Proyecto',
      component: ProjectDetailsStep,
      props: {
        project,
        onOpenDocument: (url: string) => window.open(url, '_blank'),
      },
      isValid: () => true,
    },
    {
      title: 'Precorrección',
      component: PreReviewStep,
      props: {
        decision: formData.projectReview.decision,
        observations: formData.projectReview.observations,
        onDecisionChange: (decision: 'pending' | 'correction' | 'approve' | 'reject') => {
          setFormData(prev => ({
            ...prev,
            projectReview: {
              ...prev.projectReview,
              decision,
            },
          }));
        },
        onObservationsChange: (observations: string) => {
          setFormData(prev => ({
            ...prev,
            projectReview: {
              ...prev.projectReview,
              observations,
            },
          }));
        },
      },
      isValid: () => {
        const { decision, observations } = formData.projectReview;
        if (decision === 'correction' || decision === 'reject') {
          return observations.trim() !== '';
        }
        return decision !== 'pending';
      },
    },
    {
      title: 'Formulario de Subsanación',
      component: CorrectionFormStep,
      props: {
        project,
        observations: formData.projectReview.observations,
        onFieldsChange: (fields: string[]) => {
          setFormData(prev => ({
            ...prev,
            projectReview: {
              ...prev.projectReview,
              selectedFields: fields,
            },
          }));
        },
        onDocumentsChange: (documents: string[]) => {
          setFormData(prev => ({
            ...prev,
            projectReview: {
              ...prev.projectReview,
              selectedDocuments: documents,
            },
          }));
        },
      },
      isValid: () => {
        if (formData.projectReview.decision !== 'correction') return true;
        return formData.projectReview.selectedFields.length > 0 || 
               formData.projectReview.selectedDocuments.length > 0;
      },
      showIf: () => formData.projectReview.decision === 'correction',
    },
    {
      title: 'Formulario de Corrección',
      component: ReviewFormStep,
      props: {
        project,
        data: formData.review,
        onChange: (reviewData: any) => {
          setFormData(prev => ({
            ...prev,
            review: reviewData,
          }));
        },
      },
      isValid: () => {
        if (formData.projectReview.decision !== 'approve') return true;
        if (!project.category?.rubric) return false;
        return project.category.rubric.sections.every(section =>
          section.criteria.every(criterion => formData.review.scores[criterion.id])
        );
      },
      showIf: () => formData.projectReview.decision === 'approve',
    },
  ].filter(step => !step.showIf || step.showIf());

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const { decision, observations, selectedFields, selectedDocuments } = formData.projectReview;
      
      switch (decision) {
        case 'correction':
          await onRequestCorrection(observations, selectedFields, selectedDocuments);
          break;
        case 'reject':
          await onReject(observations);
          break;
        case 'approve':
          await onSave(formData.review, false);
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nueva Corrección</h2>
            <p className="mt-1 text-sm text-gray-500">
              Paso {currentStep + 1} de {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <CurrentStepComponent {...steps[currentStep].props} />
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

          <button
            onClick={handleNext}
            disabled={!steps[currentStep].isValid() || isSaving}
            className="btn btn-primary flex items-center space-x-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Save size={20} />
                <span>
                  {isSaving ? 'Guardando...' : 
                   formData.projectReview.decision === 'correction' ? 'Solicitar subsanación' :
                   formData.projectReview.decision === 'reject' ? 'Rechazar proyecto' :
                   'Guardar corrección'}
                </span>
              </>
            ) : (
              <>
                <span>Siguiente</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewWizard;