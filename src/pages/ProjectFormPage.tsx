import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../components/projects/ProjectForm';
import { Project } from '../types/project';

// Mock data - Replace with actual API call
const mockProject: Project = {
  id: '1',
  title: 'Sistema de Monitorización IoT',
  description: 'Sistema de monitorización ambiental utilizando sensores IoT y análisis de datos en tiempo real.',
  category: 'Tecnología e Innovación',
  center: 'IES Tecnológico',
  department: 'Informática',
  status: 'reviewing',
  submissionDate: '2024-03-01',
  lastModified: '2024-03-15',
  presenters: ['1', '2'],
  reviewers: ['3'],
  score: 8.5,
  documents: [
    {
      id: '1',
      name: 'Memoria Técnica',
      type: 'pdf',
      url: '/documents/memoria.pdf',
      uploadDate: '2024-03-01',
      status: 'approved'
    }
  ],
  convocatoriaId: '1'
};

// Mock categories - Replace with data from your API
const mockCategories = [
  'Tecnología e Innovación',
  'Educación Digital',
  'Sostenibilidad',
  'Industria 4.0',
  'Salud y Bienestar',
];

const ProjectFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const handleSubmit = (data: Partial<Project>) => {
    console.log(`${isEditing ? 'Updating' : 'Creating'} project:`, data);
    // TODO: Implement API call
    navigate('/projects');
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <ProjectForm
          project={isEditing ? mockProject : undefined}
          categories={mockCategories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProjectFormPage;