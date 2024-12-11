import React, { useState } from 'react';
import { Globe, Mail, Bell, Loader2 } from 'lucide-react';

interface GeneralSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onSave, isSaving }) => {
  const [settings, setSettings] = useState({
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLanguage: 'es',
    emailNotifications: true,
    pushNotifications: true,
    systemEmails: {
      from: 'noreply@fpinnova.es',
      replyTo: 'support@fpinnova.es',
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSystemEmailChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      systemEmails: {
        ...prev.systemEmails,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    await onSave(settings);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Globe className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Localización y Formato</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Zona horaria
            </label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Europe/Madrid">España (Península)</option>
              <option value="Atlantic/Canary">España (Canarias)</option>
              <option value="Europe/London">Reino Unido</option>
              <option value="America/New_York">Estados Unidos (Este)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Formato de fecha
            </label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Formato de hora
            </label>
            <select
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="24h">24 horas</option>
              <option value="12h">12 horas (AM/PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Idioma por defecto
            </label>
            <select
              name="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="ca">Català</option>
              <option value="gl">Galego</option>
              <option value="eu">Euskara</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Notificaciones por Defecto</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notificaciones por email</p>
              <p className="text-sm text-gray-500">
                Habilitar notificaciones por correo electrónico por defecto
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notificaciones push</p>
              <p className="text-sm text-gray-500">
                Habilitar notificaciones push por defecto
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="pushNotifications"
                checked={settings.pushNotifications}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Mail className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Correos del Sistema</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección de envío
            </label>
            <input
              type="email"
              value={settings.systemEmails.from}
              onChange={(e) => handleSystemEmailChange('from', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Dirección desde la que se enviarán los correos del sistema
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección de respuesta
            </label>
            <input
              type="email"
              value={settings.systemEmails.replyTo}
              onChange={(e) => handleSystemEmailChange('replyTo', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Dirección a la que llegarán las respuestas
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
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

export default GeneralSettings;