import { FormField } from './form';

export type ProjectStatus = 
  | 'draft' 
  | 'submitted' 
  | 'reviewing' 
  | 'needs_correction'
  | 'correction_in_progress'
  | 'correction_submitted'
  | 'reviewed'
  | 'approved'
  | 'rejected';

export interface Responsible {
  name: string;
  dni: string;
  phone: string;
  specialty: string;
}

export interface Collaborator {
  type: 'center' | 'company';
  name: string;
  responsible: Responsible;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category?: {
    id: string;
    name: string;
    minCorrections?: number;
    totalBudget?: number;
    requirements?: string[];
    formFields?: FormField[];
  };
  center: string;
  department: string;
  status: ProjectStatus;
  submissionDate?: string;
  lastModified?: string;
  presenters?: string[];
  reviewers?: string[];
  reviews?: Array<{
    id: string;
    isDraft: boolean;
  }>;
  score?: number;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  convocatoriaId: string;
  mainResponsible: Responsible;
  collaborators: Collaborator[];
  requestedAmount?: number;
  correctionRequest?: {
    observations: string;
    requestedAt: string;
    submittedAt?: string;
    reviewerId: string;
    reviewerName: string;
  };
}

export const statusLabels: Record<ProjectStatus, string> = {
  draft: 'Borrador',
  submitted: 'Presentado',
  reviewing: 'En revisión',
  needs_correction: 'Requiere subsanación',
  correction_in_progress: 'En subsanación',
  correction_submitted: 'Subsanado pendiente de comprobación',
  reviewed: 'Corregido',
  approved: 'Aprobado',
  rejected: 'Rechazado'
};

export const statusColors: Record<ProjectStatus, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
  reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  needs_correction: { bg: 'bg-orange-100', text: 'text-orange-700' },
  correction_in_progress: { bg: 'bg-orange-100', text: 'text-orange-700' },
  correction_submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  reviewed: { bg: 'bg-green-100', text: 'text-green-700' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700' }
};