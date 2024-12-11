import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Specialty } from '../../types/master';
import { usePermissions } from '../../hooks/usePermissions';

interface SpecialtiesTableProps {
  specialties: Specialty[];
  searchTerm: string;
  filters: {
    active: boolean;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SpecialtiesTable: React.FC<SpecialtiesTableProps> = ({
  specialties,
  searchTerm,
  filters,
  onEdit,
  onDelete
}) => {
  const { canEdit, canDelete } = usePermissions();

  const filteredSpecialties = specialties.filter(specialty => {
    const matchesSearch = 
      specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActive = filters.active ? specialty.active : true;
    
    return matchesSearch && matchesActive;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Familia Profesional
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSpecialties.map((specialty) => (
            <tr key={specialty.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {specialty.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {specialty.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {specialty.familyId}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {specialty.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {specialty.active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-4 h-4 mr-1" />
                    Inactivo
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {canEdit('system') && (
                    <button
                      onClick={() => onEdit(specialty.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                  )}
                  {canDelete('system') && (
                    <button
                      onClick={() => onDelete(specialty.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredSpecialties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No hay especialidades para mostrar</p>
        </div>
      )}
    </div>
  );
};

export default SpecialtiesTable;