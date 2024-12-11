import React, { useState, useEffect } from 'react';
import { KeyRound, Plus, Search, Filter, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { VerificationCode, VerificationCodeStatus } from '../../types/verificationCode';
import { UserRole, roleLabels } from '../../types/user';
import { 
  generateCode, 
  listCodes, 
  revokeCode, 
  cleanupCodes 
} from '../../services/verificationCodeService';

interface VerificationCodesSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const VerificationCodesSettings: React.FC<VerificationCodesSettingsProps> = ({ 
  onSave, 
  isSaving 
}) => {
  const { settings, updateSettings } = useSettings();
  const [codes, setCodes] = useState<VerificationCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewCodeModal, setShowNewCodeModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  const [config, setConfig] = useState({
    enabled: false,
    autoCleanup: true,
    cleanupInterval: 24,
    defaultExpirationTime: 72,
    defaultMaxUses: 5
  });

  useEffect(() => {
    if (settings?.verificationCodes) {
      setConfig(settings.verificationCodes);
    }
    loadCodes();
  }, [settings]);

  const loadCodes = async () => {
    setIsLoading(true);
    try {
      const allCodes = await listCodes();
      setCodes(allCodes);
    } catch (error) {
      console.error('Error loading codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = async (changes: Partial<typeof config>) => {
    const newConfig = { ...config, ...changes };
    setConfig(newConfig);
    
    const updatedSettings = {
      verificationCodes: newConfig
    };

    await updateSettings(updatedSettings);
    if (onSave) {
      await onSave(updatedSettings);
    }
  };

  const handleGenerateCode = async (type: UserRole, expirationHours: number, maxUses: number) => {
    try {
      await generateCode(type, expirationHours, maxUses);
      loadCodes();
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const handleRevokeCode = async (id: string) => {
    try {
      await revokeCode(id);
      loadCodes();
    } catch (error) {
      console.error('Error revoking code:', error);
    }
  };

  const handleCleanup = async () => {
    try {
      await cleanupCodes();
      loadCodes();
    } catch (error) {
      console.error('Error cleaning up codes:', error);
    }
  };

  const filteredCodes = codes.filter(code => {
    if (filters.type !== 'all' && code.type !== filters.type) return false;
    if (filters.status !== 'all' && code.status !== filters.status) return false;
    if (filters.search && !code.code.includes(filters.search.toUpperCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <KeyRound className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Códigos de Verificación</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Sistema de códigos de verificación</p>
              <p className="text-sm text-gray-500">
                Habilitar el sistema de códigos para el registro de usuarios
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleConfigChange({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Limpieza automática</p>
              <p className="text-sm text-gray-500">
                Eliminar automáticamente los códigos caducados o agotados
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoCleanup}
                onChange={(e) => handleConfigChange({ autoCleanup: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Intervalo de limpieza (horas)
              </label>
              <input
                type="number"
                value={config.cleanupInterval}
                onChange={(e) => handleConfigChange({ cleanupInterval: Number(e.target.value) })}
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Caducidad por defecto (horas)
              </label>
              <input
                type="number"
                value={config.defaultExpirationTime}
                onChange={(e) => handleConfigChange({ defaultExpirationTime: Number(e.target.value) })}
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usos máximos por defecto
              </label>
              <input
                type="number"
                value={config.defaultMaxUses}
                onChange={(e) => handleConfigChange({ defaultMaxUses: Number(e.target.value) })}
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Códigos Generados</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCleanup}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw size={20} />
              <span>Limpiar caducados</span>
            </button>
            <button
              onClick={() => setShowNewCodeModal(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Generar código</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar códigos..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los tipos</option>
              {Object.entries(roleLabels).map(([role, label]) => (
                <option key={role} value={role}>{label}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="used">Usados</option>
              <option value="expired">Caducados</option>
              <option value="revoked">Revocados</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">Cargando códigos...</p>
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron códigos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Caducidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCodes.map((code) => (
                  <tr key={code.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm">{code.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {roleLabels[code.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        code.status === 'active' ? 'bg-green-100 text-green-800' :
                        code.status === 'used' ? 'bg-gray-100 text-gray-800' :
                        code.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {code.status === 'active' ? 'Activo' :
                         code.status === 'used' ? 'Usado' :
                         code.status === 'expired' ? 'Caducado' :
                         'Revocado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {code.currentUses}/{code.maxUses}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(code.expiresAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {code.status === 'active' && (
                        <button
                          onClick={() => handleRevokeCode(code.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showNewCodeModal && (
        <NewCodeModal
          onClose={() => setShowNewCodeModal(false)}
          onGenerate={handleGenerateCode}
          defaultExpiration={config.defaultExpirationTime}
          defaultMaxUses={config.defaultMaxUses}
        />
      )}
    </div>
  );
};

interface NewCodeModalProps {
  onClose: () => void;
  onGenerate: (type: UserRole, expirationHours: number, maxUses: number) => Promise<void>;
  defaultExpiration: number;
  defaultMaxUses: number;
}

const NewCodeModal: React.FC<NewCodeModalProps> = ({
  onClose,
  onGenerate,
  defaultExpiration,
  defaultMaxUses
}) => {
  const [type, setType] = useState<UserRole>('presenter');
  const [expirationHours, setExpirationHours] = useState(defaultExpiration);
  const [maxUses, setMaxUses] = useState(defaultMaxUses);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await onGenerate(type, expirationHours, maxUses);
      onClose();
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generar nuevo código
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de código
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as UserRole)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                >
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <option key={role} value={role}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Caducidad (horas)
                </label>
                <input
                  type="number"
                  value={expirationHours}
                  onChange={(e) => setExpirationHours(Number(e.target.value))}
                  min="1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usos máximos
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  min="1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isGenerating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus size={20} />
              )}
              <span>{isGenerating ? 'Generando...' : 'Generar código'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationCodesSettings;