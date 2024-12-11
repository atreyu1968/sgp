import React, { useState } from 'react';
import { Layout, List, Grid, Loader2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface ViewSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const ViewSettings: React.FC<ViewSettingsProps> = ({ onSave, isSaving }) => {
  const { settings, updateSettings } = useSettings();
  const [defaultViews, setDefaultViews] = useState(settings?.views?.defaultViews || {
    projects: 'grid',
    users: 'grid',
    convocatorias: 'grid'
  });

  const handleViewChange = (section: keyof typeof defaultViews, view: 'grid' | 'list') => {
    const newViews = {
      ...defaultViews,
      [section]: view
    };
    setDefaultViews(newViews);
  };

  const handleSave = async () => {
    const newSettings = {
      views: {
        ...settings?.views,
        defaultViews
      }
    };

    await updateSettings(newSettings);
    if (onSave) {
      await onSave(newSettings);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Layout className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Vistas por Defecto</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista de Proyectos
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleViewChange('projects', 'grid')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  defaultViews.projects === 'grid'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid className="mr-2" size={20} />
                Cuadrícula
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('projects', 'list')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  defaultViews.projects === 'list'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="mr-2" size={20} />
                Lista
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista de Usuarios
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleViewChange('users', 'grid')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  defaultViews.users === 'grid'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid className="mr-2" size={20} />
                Cuadrícula
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('users', 'list')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  defaultViews.users === 'list'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="mr-2" size={20} />
                Lista
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista de Convocatorias
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleViewChange('convocatorias', 'grid')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  defaultViews.convocatorias === 'grid'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid className="mr-2" size={20} />
                Cuadrícula
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('convocatorias', 'list')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  defaultViews.convocatorias === 'list'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="mr-2" size={20} />
                Lista
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary flex items-center space-x-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isSaving ? 'Guardando...' : 'Guardar cambios'}</span>
        </button>
      </div>
    </div>
  );
};

export default ViewSettings;