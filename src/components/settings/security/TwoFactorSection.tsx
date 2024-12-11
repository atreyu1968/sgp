import React from 'react';
import { Shield } from 'lucide-react';

interface TwoFactorSectionProps {
  onToggleSMS: (enabled: boolean) => void;
  onToggleApp: (enabled: boolean) => void;
  smsEnabled: boolean;
  appEnabled: boolean;
}

const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({
  onToggleSMS,
  onToggleApp,
  smsEnabled,
  appEnabled
}) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="text-gray-400" size={20} />
        <h3 className="text-base font-medium text-gray-900">Verificación en dos pasos</h3>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-900">Autenticación por SMS</p>
          <p className="text-sm text-gray-500">
            Recibe un código por SMS para verificar tu identidad
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={smsEnabled}
            onChange={(e) => onToggleSMS(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-900">Aplicación de autenticación</p>
          <p className="text-sm text-gray-500">
            Usa una aplicación como Google Authenticator
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={appEnabled}
            onChange={(e) => onToggleApp(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export default TwoFactorSection;