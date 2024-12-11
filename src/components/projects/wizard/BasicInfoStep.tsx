import React from 'react';
import { Project } from '../../../types/project';
import CollaboratorsForm from '../CollaboratorsForm';
import { useMasterData } from '../../../context/MasterDataContext';

interface BasicInfoStepProps {
  data: Partial<Project>;
  convocatoria: any;
  onChange: (data: Partial<Project>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  convocatoria,
  onChange,
}) => {
  const { getActiveSpecialties } = useMasterData();
  const specialties = getActiveSpecialties().map(s => s.name);

  return (
    <div className="space-y-8">
      {/* Project Basic Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información del Proyecto
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título del proyecto *
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción *
            </label>
            <textarea
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <select
              value={data.category?.id}
              onChange={(e) => {
                const category = convocatoria.categories.find(
                  (c: any) => c.id === e.target.value
                );
                onChange({ category });
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona una categoría</option>
              {convocatoria.categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {data.category && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">{data.category.description}</p>
                <div className="mt-2 bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Requisitos de la categoría:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-blue-700">
                    {data.category.requirements.map((req: string) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Centro educativo *
              </label>
              <input
                type="text"
                value={data.center}
                onChange={(e) => onChange({ center: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Departamento *
              </label>
              <input
                type="text"
                value={data.department}
                onChange={(e) => onChange({ department: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Importe solicitado *
            </label>
            <input
              type="number"
              value={data.requestedAmount || ''}
              onChange={(e) => onChange({ requestedAmount: Number(e.target.value) })}
              min={0}
              max={data.category?.totalBudget || 50000}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {data.category?.totalBudget && (
              <p className="mt-1 text-sm text-gray-500">
                Presupuesto máximo: {data.category.totalBudget.toLocaleString('es-ES')}€
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Collaborators Section */}
      <CollaboratorsForm
        mainResponsible={data.mainResponsible || {
          name: '',
          dni: '',
          phone: '',
          specialty: ''
        }}
        collaborators={data.collaborators || []}
        specialties={specialties}
        onMainResponsibleChange={(responsible) => onChange({ mainResponsible: responsible })}
        onCollaboratorAdd={(collaborator) => onChange({
          collaborators: [...(data.collaborators || []), collaborator]
        })}
        onCollaboratorRemove={(index) => onChange({
          collaborators: (data.collaborators || []).filter((_, i) => i !== index)
        })}
        onCollaboratorChange={(index, collaborator) => onChange({
          collaborators: (data.collaborators || []).map((c, i) => 
            i === index ? collaborator : c
          )
        })}
      />
    </div>
  );
};

export default BasicInfoStep;