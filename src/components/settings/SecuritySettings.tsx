import React, { useState } from 'react';
import PasswordSection from './security/PasswordSection';
import TwoFactorSection from './security/TwoFactorSection';
import ActivitySection from './security/ActivitySection';

const SecuritySettings: React.FC = () => {
  const [twoFactorSettings, setTwoFactorSettings] = useState({
    smsEnabled: false,
    appEnabled: false
  });

  // Mock data - Replace with API call
  const recentActivity = [
    {
      action: 'Inicio de sesión',
      device: 'Chrome en Windows',
      location: 'Madrid, España',
      date: '2024-03-15 10:30',
    },
    {
      action: 'Cambio de contraseña',
      device: 'Firefox en MacOS',
      location: 'Barcelona, España',
      date: '2024-03-10 15:45',
    },
    {
      action: 'Inicio de sesión',
      device: 'Safari en iOS',
      location: 'Valencia, España',
      date: '2024-03-08 09:15',
    },
  ];

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    // TODO: Implement API call
    console.log('Changing password:', { currentPassword, newPassword });
  };

  const handleToggleSMS = (enabled: boolean) => {
    setTwoFactorSettings(prev => ({ ...prev, smsEnabled: enabled }));
  };

  const handleToggleApp = (enabled: boolean) => {
    setTwoFactorSettings(prev => ({ ...prev, appEnabled: enabled }));
  };

  return (
    <div className="space-y-8">
      <PasswordSection onPasswordChange={handlePasswordChange} />
      
      <TwoFactorSection
        smsEnabled={twoFactorSettings.smsEnabled}
        appEnabled={twoFactorSettings.appEnabled}
        onToggleSMS={handleToggleSMS}
        onToggleApp={handleToggleApp}
      />
      
      <ActivitySection recentActivity={recentActivity} />
    </div>
  );
};

export default SecuritySettings;