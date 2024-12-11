import React from 'react';
import ProfileSettings from '../components/settings/ProfileSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import { useAuth } from '../hooks/useAuth';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
      
      <div className="space-y-6">
        <ProfileSettings user={user} />
        <NotificationSettings />
        <SecuritySettings />
      </div>
    </div>
  );
};

export default SettingsPage;