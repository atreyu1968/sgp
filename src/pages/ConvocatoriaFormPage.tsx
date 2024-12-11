import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConvocatoriaForm from '../components/convocatorias/ConvocatoriaForm';
import { Convocatoria } from '../types/convocatoria';

// Mock data - Replace with actual API call
const mockConvocatoria: Convocatoria = {
  id: '1',
  title: 'Convocatoria FP Innova 2024',
  description: 'Proyectos de innovación en Formación Profesional para el año académico 2024.',
  startDate: '2024-03-01',
  endDate: '2024-06-30',
  status: 'active',
  year: 2024,
  documentationDeadline: '2024-05-15',
  reviewDeadline: '2024-06-15',
  categories: [
    {
      id: '1',
      name: 'Tecnología e Innovación',
      description: 'Proyectos tecnológicos innovadores',
      maxParticipants: 4,
      requirements: ['Memoria técnica', 'Presupuesto', 'Video demostrativo'],
    },
    {
      id: '2',
      name: 'Sostenibilidad',
      description: 'Proyectos enfocados en sostenibilidad y medio ambiente',
      maxParticipants: 4,
      requirements: ['Memoria técnica', 'Estudio de impacto ambiental'],
    },
  ],
  createdAt: '2024-02-01',
  updatedAt: '2024-02-01',
};

const ConvocatoriaFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const handleSubmit = (data: Partial<Convocatoria>) => {
    console.log(`${isEditing ? 'Updating' : 'Creating'} convocatoria:`, data);
    // TODO: Implement API call
    navigate('/convocatorias');
  };

  const handleCancel = () => {
    navigate('/convocatorias');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Editar Convocatoria' : 'Nueva Convocatoria'}
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <ConvocatoriaForm
          initialData={isEditing ? mockConvocatoria : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ConvocatoriaFormPage;