import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { validateDNI } from '../../utils/validation';

interface Responsible {
  name: string;
  dni: string;
  phone: string;
  specialty: string;
}

interface Collaborator {
  type: 'center' | 'company';
  name: string;
  responsible: Responsible;
}

interface CollaboratorsFormProps {
  mainResponsible: Responsible;
  collaborators: Collaborator[];
  specialties: string[];
  onMainResponsibleChange: (responsible: Responsible) => void;
  onCollaboratorAdd: (collaborator: Collaborator) => void;
  onCollaboratorRemove: (index: number) => void;
  onCollaboratorChange: (index: number, collaborator: Collaborator) => void;
}

const CollaboratorsForm: React.FC<CollaboratorsFormProps> = ({
  mainResponsible,
  collaborators,
  specialties,
  onMainResponsibleChange,
  onCollaboratorAdd,
  onCollaboratorRemove,
  onCollaboratorChange,
}) => {
  const handleMainResponsibleChange = (field: keyof Responsible, value: string) => {
    if (field === 'dni') {
      value = value.toUpperCase();
      if (!validateDNI(value)) {
        return; // Don't update if DNI is invalid
      }
    }
    onMainResponsibleChange({ ...mainResponsible, [field]: value });
  };

  const handleCollaboratorChange = (index: number, field: string, value: string) => {
    const collaborator = { ...collaborators[index] };
    if (field.startsWith('responsible.')) {
      const responsibleField = field.split('.')[1] as keyof Responsible;
      if (responsibleField === 'dni') {
        value = value.toUpperCase();
        if (!validateDNI(value)) {
          return; // Don't update if DNI is invalid
        }
      }
      collaborator.responsible = {
        ...collaborator.responsible,
        [responsibleField]: value
      };
    } else {
      (collaborator as any)[field] = value;
    }
    onCollaboratorChange(index, collaborator);
  };

  const addCollaborator = (type: 'center' | 'company') => {
    onCollaboratorAdd({
      type,
      name: '',
      responsible: {
        name: '',
        dni: '',
        phone: '',
        specialty: ''
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Main Responsible */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Responsable Principal del Proyecto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre completo *
            </label>
            <input
              type="text"
              value={mainResponsible.name}
              onChange={(e) => handleMainResponsibleChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DNI/NIE *
            </label>
            <input
              type="text"
              value={mainResponsible.dni}
              onChange={(e) => handleMainResponsibleChange('dni', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="12345678X"
              maxLength={9}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono móvil *
            </label>
            <input
              type="tel"
              value={mainResponsible.phone}
              onChange={(e) => handleMainResponsibleChange('phone', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="666777888"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Especialidad *
            </label>
            <select
              value={mainResponsible.specialty}
              onChange={(e) => handleMainResponsibleChange('specialty', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Seleccionar especialidad</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Collaborators */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Centros y Empresas Colaboradoras
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => addCollaborator('center')}
              className="btn btn-secondary"
            >
              <Plus size={20} className="mr-2" />
              Añadir Centro
            </button>
            <button
              type="button"
              onClick={() => addCollaborator('company')}
              className="btn btn-secondary"
            >
              <Plus size={20} className="mr-2" />
              Añadir Empresa
            </button>
          </div>
        </div>

        {collaborators.map((collaborator, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-medium text-gray-900">
                {collaborator.type === 'center' ? 'Centro Colaborador' : 'Empresa Colaboradora'}
              </h4>
              <button
                type="button"
                onClick={() => onCollaboratorRemove(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del {collaborator.type === 'center' ? 'centro' : 'empresa'} *
                </label>
                <input
                  type="text"
                  value={collaborator.name}
                  onChange={(e) => handleCollaboratorChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del responsable *
                </label>
                <input
                  type="text"
                  value={collaborator.responsible.name}
                  onChange={(e) => handleCollaboratorChange(index, 'responsible.name', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DNI/NIE del responsable *
                </label>
                <input
                  type="text"
                  value={collaborator.responsible.dni}
                  onChange={(e) => handleCollaboratorChange(index, 'responsible.dni', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="12345678X"
                  maxLength={9}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono del responsable *
                </label>
                <input
                  type="tel"
                  value={collaborator.responsible.phone}
                  onChange={(e) => handleCollaboratorChange(index, 'responsible.phone', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="666777888"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Especialidad del responsable *
                </label>
                <select
                  value={collaborator.responsible.specialty}
                  onChange={(e) => handleCollaboratorChange(index, 'responsible.specialty', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Seleccionar especialidad</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaboratorsForm;