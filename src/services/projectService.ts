import { Project, ProjectStatus } from '../types/project';

const PROJECTS_STORAGE_KEY = 'projects';
const REVIEWERS_STORAGE_KEY = 'project_reviewers';

function getStoredData(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function updateProjectStatus(
  projectId: string, 
  status: ProjectStatus,
  correctionRequest?: {
    observations: string;
    reviewerId: string;
    reviewerName: string;
  }
) {
  try {
    const projectsData = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const projects = projectsData ? JSON.parse(projectsData) : [];
    
    const updatedProjects = projects.map((p: Project) => {
      if (p.id === projectId) {
        const updates: Partial<Project> = { status };
        
        if (correctionRequest) {
          updates.correctionRequest = {
            ...correctionRequest,
            requestedAt: new Date().toISOString(),
          };
        }
        
        return { ...p, ...updates };
      }
      return p;
    });

    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    return true;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

export async function submitCorrection(projectId: string, files: File[]) {
  try {
    const projectsData = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const projects = projectsData ? JSON.parse(projectsData) : [];
    
    const updatedProjects = projects.map((p: Project) => {
      if (p.id === projectId) {
        // Add new documents
        const newDocuments = files.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadDate: new Date().toISOString(),
          status: 'pending' as const
        }));

        return {
          ...p,
          status: 'correction_submitted' as ProjectStatus,
          documents: [...(p.documents || []), ...newDocuments],
          correctionRequest: p.correctionRequest ? {
            ...p.correctionRequest,
            submittedAt: new Date().toISOString()
          } : undefined
        };
      }
      return p;
    });

    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    return true;
  } catch (error) {
    console.error('Error submitting correction:', error);
    throw error;
  }
}

export async function assignReviewers(projectId: string, reviewers: Array<{ id: string; name: string; role: string }>) {
  try {
    // Get current project data
    const projectsData = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const projects = projectsData ? JSON.parse(projectsData) : [];
    
    // Update project reviewers
    const updatedProjects = projects.map((p: Project) => {
      if (p.id === projectId) {
        // Update project status to 'reviewing' if not in draft
        const newStatus = p.status === 'draft' ? 'draft' : 'reviewing';
        return {
          ...p,
          reviewers: reviewers.map(r => r.id),
          status: newStatus
        };
      }
      return p;
    });

    // Save updated projects
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));

    // Update reviewers data
    const reviewersData = getStoredData(REVIEWERS_STORAGE_KEY);
    reviewersData[projectId] = reviewers.map(r => ({
      ...r,
      hasReviewed: false,
      score: null
    }));
    saveStoredData(REVIEWERS_STORAGE_KEY, reviewersData);

    return true;
  } catch (error) {
    console.error('Error assigning reviewers:', error);
    throw error;
  }
}

export async function getProjectReviewers(projectId: string) {
  const reviewersData = getStoredData(REVIEWERS_STORAGE_KEY);
  return reviewersData[projectId] || [];
}

export async function updateReviewerStatus(projectId: string, reviewerId: string, hasReviewed: boolean, score?: number) {
  const reviewersData = getStoredData(REVIEWERS_STORAGE_KEY);
  
  if (reviewersData[projectId]) {
    reviewersData[projectId] = reviewersData[projectId].map((r: any) => 
      r.id === reviewerId ? { ...r, hasReviewed, score } : r
    );
    saveStoredData(REVIEWERS_STORAGE_KEY, reviewersData);
  }
}