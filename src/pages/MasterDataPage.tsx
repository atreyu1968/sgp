import React, { useState } from 'react';
import { Database, Upload, Download, Plus, Search, Filter } from 'lucide-react';
import { MasterDataType } from '../types/master';
import MasterDataTable from '../components/master-data/MasterDataTable';
import SpecialtiesTable from '../components/master-data/SpecialtiesTable';
import MasterDataForm from '../components/master-data/MasterDataForm';
import ImportModal from '../components/master-data/ImportModal';
import { usePermissions } from '../hooks/usePermissions';
import { useMasterData } from '../context/MasterDataContext';

const MasterDataPage: React.FC = () => {
  const { canCreate, canEdit } = usePermissions();
  const { specialties, addSpecialty, updateSpecialty, deleteSpecialty } = useMasterData();
  const [selectedType, setSelectedType] = useState<MasterDataType>('specialties');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    active: true
  });
  const [editingId, setEditingId] = useState<string | undefined>();

  const handleDownloadTemplate = () => {
    const template = generateTemplate(selectedType);
    const url = window.URL.createObjectURL(template);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template_${selectedType}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    if (!user) return;
    return importData(selectedType, file, user.id, user.name);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      deleteSpecialty(id);
    }
  };

  const getTypeLabel = (type: MasterDataType): string => {
    const labels: Record<MasterDataType, string> = {
      centers: 'Centros Educativos',
      families: 'Familias Profesionales',
      cycles: 'Ciclos Formativos',
      courses: 'Cursos',
      specialties: 'Especialidades'
    };
    return labels[type];
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Datos Maestros</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de datos maestros del sistema
          </p>
        </div>
        {canEdit('system') && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowImport(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Upload size={20} />
              <span>Importar</span>
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Plantilla</span>
            </button>
            <button
              onClick={() => {
                setEditingId(undefined);
                setShowForm(true);
              }}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nuevo registro</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Database className="text-gray-400" size={24} />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MasterDataType)}
                className="text-lg font-semibold text-gray-900 border-none focus:ring-0 py-0 pl-0"
              >
                <option value="specialties">Especialidades</option>
                <option value="families">Familias Profesionales</option>
                <option value="cycles">Ciclos Formativos</option>
                <option value="courses">Cursos</option>
                <option value="centers">Centros Educativos</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Buscar ${getTypeLabel(selectedType).toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => {}} // TODO: Implement filters modal
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {selectedType === 'specialties' ? (
          <SpecialtiesTable
            specialties={specialties}
            searchTerm={searchTerm}
            filters={filters}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <MasterDataTable
            type={selectedType}
            searchTerm={searchTerm}
            filters={filters}
            onEdit={handleEdit}
          />
        )}
      </div>

      {showForm && (
        <MasterDataForm
          type={selectedType}
          entityId={editingId}
          onClose={() => {
            setShowForm(false);
            setEditingId(undefined);
          }}
        />
      )}

      {showImport && (
        <ImportModal
          type={selectedType}
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default MasterDataPage;