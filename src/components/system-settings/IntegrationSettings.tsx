import React, { useState } from 'react';
import { Link2, Key, RefreshCw } from 'lucide-react';

const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState({
    googleAuth: {
      enabled: false,
      clientId: '',
      clientSecret: '',
    },
    microsoftAuth: {
      enabled: false,
      clientId: '',
      clientSecret: '',
    },
    storage: {
      provider: 'local',
      s3: {
        bucket: '',
        accessKey: '',
        secretKey: '',
        region: '',
      },
    },
    analytics: {
      enabled: false,
      trackingId: '',
    },
  });

  const handleIntegrationToggle = (integration: 'googleAuth' | 'microsoftAuth' | 'analytics') => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        enabled: !prev[integration].enabled,
      },
    }));
  };

  const handleInputChange = (
    integration: string,
    field: string,
    value: string,
    nested?: string
  ) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: nested
        ? {
            ...prev[integration],
            [nested]: {
              ...prev[integration][nested],
              [field]: value,
            },
          }
        : {
            ...prev[integration],
            [field]: value,
          },
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Link2 className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Autenticación Social</h3>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Google</p>
                <p className="text-sm text-gray-500">
                  Permitir inicio de sesión con Google
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.googleAuth.enabled}
                  onChange={() => handleIntegrationToggle('googleAuth')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {integrations.googleAuth.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={integrations.googleAuth.clientId}
                    onChange={(e) =>
                      handleInputChange('googleAuth', 'clientId', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={integrations.googleAuth.clientSecret}
                    onChange={(e) =>
                      handleInputChange('googleAuth', 'clientSecret', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Microsoft</p>
                <p className="text-sm text-gray-500">
                  Permitir inicio de sesión con Microsoft
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations.microsoftAuth.enabled}
                  onChange={() => handleIntegrationToggle('microsoftAuth')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {integrations.microsoftAuth.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={integrations.microsoftAuth.clientId}
                    onChange={(e) =>
                      handleInputChange('microsoftAuth', 'clientId', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={integrations.microsoftAuth.clientSecret}
                    onChange={(e) =>
                      handleInputChange('microsoftAuth', 'clientSecret', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Key className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Almacenamiento</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor de Almacenamiento
            </label>
            <select
              value={integrations.storage.provider}
              onChange={(e) =>
                handleInputChange('storage', 'provider', e.target.value)
              }
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="local">Local</option>
              <option value="s3">Amazon S3</option>
            </select>
          </div>

          {integrations.storage.provider === 's3' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bucket
                </label>
                <input
                  type="text"
                  value={integrations.storage.s3.bucket}
                  onChange={(e) =>
                    handleInputChange('storage', 'bucket', e.target.value, 's3')
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Region
                </label>
                <input
                  type="text"
                  value={integrations.storage.s3.region}
                  onChange={(e) =>
                    handleInputChange('storage', 'region', e.target.value, 's3')
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Access Key
                </label>
                <input
                  type="text"
                  value={integrations.storage.s3.accessKey}
                  onChange={(e) =>
                    handleInputChange('storage', 'accessKey', e.target.value, 's3')
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={integrations.storage.s3.secretKey}
                  onChange={(e) =>
                    handleInputChange('storage', 'secretKey', e.target.value, 's3')
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <RefreshCw className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Google Analytics</p>
              <p className="text-sm text-gray-500">
                Habilitar seguimiento de analytics
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.analytics.enabled}
                onChange={() => handleIntegrationToggle('analytics')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {integrations.analytics.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tracking ID
              </label>
              <input
                type="text"
                value={integrations.analytics.trackingId}
                onChange={(e) =>
                  handleInputChange('analytics', 'trackingId', e.target.value)
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="UA-XXXXXXXXX-X"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="btn btn-primary">
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default IntegrationSettings;