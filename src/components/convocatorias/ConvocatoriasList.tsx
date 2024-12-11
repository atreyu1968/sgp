import React, { useState } from 'react';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import ConvocatoriaCard from './ConvocatoriaCard';
import { Convocatoria } from '../../types/convocatoria';
import { useViewMode } from '../../hooks/useViewMode';

interface ConvocatoriasListProps {
  convocatorias: Convocatoria[];
  onConvocatoriaClick: (id: string) => void;
  onNewConvocatoria: () => void;
}

const ConvocatoriasList: React.FC<ConvocatoriasListProps> = ({
  convocatorias,
  onConvocatoriaClick,
  onNewConvocatoria,
}) => {
  const { viewMode, changeViewMode } = useViewMode('convocatorias');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConvocatorias = convocatorias.filter(
    (convocatoria) =>
      convocatoria.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convocatoria.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Convocatorias</h1>
        <button
          onClick={onNewConvocatoria}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nueva Convocatoria</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar convocatorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => changeViewMode('grid')}
            className={`p-2 ${
              viewMode === 'grid'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Vista en cuadrícula"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => changeViewMode('list')}
            className={`p-2 ${
              viewMode === 'list'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Vista en lista"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {filteredConvocatorias.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron convocatorias</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredConvocatorias.map((convocatoria) => (
            <ConvocatoriaCard
              key={convocatoria.id}
              convocatoria={convocatoria}
              onClick={() => onConvocatoriaClick(convocatoria.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConvocatoriasList;