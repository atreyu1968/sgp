import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Política de Privacidad</h1>
            </div>
            <img
              src={settings?.appearance?.branding?.logo}
              alt="Logo"
              className="h-12"
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Última actualización: {new Date(settings?.legal?.privacyPolicy?.lastUpdated || '').toLocaleDateString('es-ES')}
            </p>

            <div className="whitespace-pre-wrap">
              {settings?.legal?.privacyPolicy?.content || 'No se ha definido la política de privacidad.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;