import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wand2 } from 'lucide-react';
import ProjectsList from '../components/projects/ProjectsList';
import ProjectWizard from '../components/projects/ProjectWizard';
import ProjectDetails from '../components/projects/ProjectDetails';
import ReviewsList from '../components/reviews/ReviewsList';
import ReviewerAssignmentModal from '../components/projects/ReviewerAssignmentModal';
import ReviewWizard from '../components/reviews/ReviewWizard';
import { Project } from '../types/project';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../context/ProjectsContext';
import { useReviews } from '../context/ReviewsContext';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, updateProject } = useProjects();
  const { addReview } = useReviews();
  const [showWizard, setShowWizard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const [showReviewWizard, setShowReviewWizard] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEditProject = (id: string) => {
    navigate(`/projects/edit/${id}`);
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const handleViewReviews = (project: Project) => {
    setSelectedProject(project);
    setShowReviews(true);
  };

  const handleAssignReviewers = (project: Project) => {
    setSelectedProject(project);
    setShowReviewerModal(true);
  };

  const handleNewReview = () => {
    if (selectedProject) {
      setShowReviewWizard(true);
      setShowReviews(false);
    }
  };

  const handleSaveProject = async (projectData: Partial<Project>, status: string) => {
    console.log('Saving project:', projectData, status);
    setShowWizard(false);
  };

  const handleSaveReviewers = async (reviewerIds: string[]) => {
    if (!selectedProject) return;
    try {
      updateProject(selectedProject.id, { reviewers: reviewerIds });
      setShowReviewerModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error saving reviewers:', error);
      alert('Error al guardar los correctores');
    }
  };

  const handleSaveReview = async (reviewData: any, isDraft: boolean) => {
    if (!selectedProject || !user) return;
    
    try {
      await addReview({
        ...reviewData,
        projectId: selectedProject.id,
        reviewerId: user.id,
        reviewerName: user.name,
        isDraft
      });
      setShowReviewWizard(false);
    } catch (error) {
      console.error('Error saving review:', error);
      // TODO: Show error toast
    }
  };

  const handleRequestCorrection = async (observations: string) => {
    if (!selectedProject || !user) return;
    
    try {
      await updateProject(selectedProject.id, {
        status: 'needs_correction',
        correctionRequest: {
          observations,
          requestedAt: new Date().toISOString(),
          reviewerId: user.id,
          reviewerName: user.name
        }
      });
      setShowReviewWizard(false);
    } catch (error) {
      console.error('Error requesting correction:', error);
      // TODO: Show error toast
    }
  };

  const canUseWizard = user?.role === 'presenter' || user?.role === 'admin' || user?.role === 'coordinator';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
        <div className="flex items-center space-x-4">
          {canUseWizard && (
            <button
              onClick={() => setShowWizard(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Wand2 size={20} />
              <span>Asistente de presentación</span>
            </button>
          )}
          <button
            onClick={handleNewProject}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo proyecto</span>
          </button>
        </div>
      </div>

      <ProjectsList
        projects={projects}
        onEditProject={handleEditProject}
        onNewProject={handleNewProject}
        onViewProject={handleViewProject}
        onViewReviews={handleViewReviews}
        onAssignReviewers={handleAssignReviewers}
      />

      {showWizard && (
        <ProjectWizard
          convocatoria={mockConvocatoria}
          onClose={() => setShowWizard(false)}
          onSave={handleSaveProject}
        />
      )}

      {selectedProject && showDetails && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => {
            setSelectedProject(null);
            setShowDetails(false);
          }}
        />
      )}

      {selectedProject && showReviews && (
        <ReviewsList
          project={selectedProject}
          reviews={[]}
          assignedReviewers={[]}
          onClose={() => {
            setSelectedProject(null);
            setShowReviews(false);
          }}
          onViewReview={() => {}}
          onEditReview={() => {}}
          onDeleteReview={() => {}}
        />
      )}

      {selectedProject && showReviewerModal && (
        <ReviewerAssignmentModal
          project={selectedProject}
          onClose={() => {
            setShowReviewerModal(false);
            setSelectedProject(null);
          }}
          onSave={handleSaveReviewers}
        />
      )}

      {selectedProject && showReviewWizard && (
        <ReviewWizard
          project={selectedProject}
          onClose={() => setShowReviewWizard(false)}
          onSave={handleSaveReview}
          onRequestCorrection={handleRequestCorrection}
        />
      )}
    </div>
  );
};

export default ProjectsPage;