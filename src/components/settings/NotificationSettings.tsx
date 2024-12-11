import React, { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    email: {
      newProject: true,
      projectUpdates: true,
      reviewAssigned: true,
      deadlineReminders: true,
    },
    push: {
      newProject: false,
      projectUpdates: true,
      reviewAssigned: true,
      deadlineReminders: false,
    },
    inApp: {
      newProject: true,
      projectUpdates: true,
      reviewAssigned: true,
      deadlineReminders: true,
    },
  });

  const handleToggle = (category: keyof typeof settings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]],
      },
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Notificaciones</h2>

      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="text-gray-400" size={20} />
            <h3 className="text-base font-medium text-gray-900">Correo electrónico</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {key === 'newProject' && 'Nuevos proyectos'}
                  {key === 'projectUpdates' && 'Actualizaciones de proyectos'}
                  {key === 'reviewAssigned' && 'Asignación de revisiones'}
                  {key === 'deadlineReminders' && 'Recordatorios de plazos'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggle('email', key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="text-gray-400" size={20} />
            <h3 className="text-base font-medium text-gray-900">Notificaciones push</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.push).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {key === 'newProject' && 'Nuevos proyectos'}
                  {key === 'projectUpdates' && 'Actualizaciones de proyectos'}
                  {key === 'reviewAssigned' && 'Asignación de revisiones'}
                  {key === 'deadlineReminders' && 'Recordatorios de plazos'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggle('push', key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="text-gray-400" size={20} />
            <h3 className="text-base font-medium text-gray-900">Notificaciones en la aplicación</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.inApp).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {key === 'newProject' && 'Nuevos proyectos'}
                  {key === 'projectUpdates' && 'Actualizaciones de proyectos'}
                  {key === 'reviewAssigned' && 'Asignación de revisiones'}
                  {key === 'deadlineReminders' && 'Recordatorios de plazos'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleToggle('inApp', key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;