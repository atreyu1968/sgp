import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Convocatoria } from '../../types/convocatoria';

interface ConvocatoriaCardProps {
  convocatoria: Convocatoria;
  onClick: (id: string) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-700',
  archived: 'bg-blue-100 text-blue-700',
};

const statusLabels = {
  draft: 'Borrador',
  active: 'Activa',
  closed: 'Cerrada',
  archived: 'Archivada',
};

const ConvocatoriaCard: React.FC<ConvocatoriaCardProps> = ({ convocatoria, onClick }) => {
  const formattedDate = new Date(convocatoria.startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div 
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(convocatoria.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{convocatoria.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[convocatoria.status]}`}>
          {statusLabels[convocatoria.status]}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{convocatoria.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <Calendar size={18} className="mr-2" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Users size={18} className="mr-2" />
          <span>{convocatoria.categories.length} categorías</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock size={18} className="mr-2" />
          <span>Plazo de documentación: {new Date(convocatoria.documentationDeadline).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
    </div>
  );
};

export default ConvocatoriaCard;