import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

const InvalidCodePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src={settings?.appearance?.branding?.logo}
            alt="Logo"
            className="h-32 mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Código Inválido
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            El código de verificación introducido no es válido o ha caducado
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate('/verify')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Intentar con otro código
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvalidCodePage;