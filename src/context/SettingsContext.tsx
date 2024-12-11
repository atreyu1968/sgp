import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings } from '../types/settings';
import { logger } from '../utils/logger';

interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<boolean>;
  applySettings: (settings: Settings) => void;
}

const defaultSettings: Settings = {
  general: {
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLanguage: 'es',
    emailNotifications: true,
    pushNotifications: true,
    systemEmails: {
      from: 'noreply@proyectosinnovacion.es',
      replyTo: 'support@proyectosinnovacion.es',
    },
  },
  appearance: {
    branding: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Logotipo_del_Gobierno_de_Canarias.svg/2560px-Logotipo_del_Gobierno_de_Canarias.svg.png', 
      favicon: 'https://i.postimg.cc/CKwywHYN/favicon.jpg',
      appName: 'Proyectos de Innovación de FP',
    },
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      headerBg: '#1a237e',
      sidebarBg: '#1e2124',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
    },
  },
  views: {
    defaultViews: {
      projects: 'list',
      users: 'list',
      convocatorias: 'list',
    },
    displayOptions: {
      showDescription: true,
      showMetadata: true,
      showThumbnails: true,
      itemsPerPage: 12,
    },
    dashboardLayout: {
      showStats: true,
      showRecentActivity: true,
      showUpcomingDeadlines: true,
      showQuickActions: true,
    },
  },
  reviews: {
    allowAdminReview: false,
    allowCoordinatorReview: false,
  },
  legal: {
    termsAndConditions: {
      content: '',
      lastUpdated: new Date().toISOString()
    },
    privacyPolicy: {
      content: '',
      lastUpdated: new Date().toISOString()
    }
  }
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updateSettings: async () => false,
  applySettings: () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [persistenceTimeout, setPersistenceTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const applySettings = React.useCallback((settings: Settings) => {
    logger.debug('Applying settings', settings);

    // Aplicar colores CSS
    const root = document.documentElement;
    const colors = settings.appearance.colors;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Actualizar título de la página
    document.title = settings.appearance.branding.appName;
    
    // Actualizar favicon si existe
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon && settings.appearance.branding.favicon) {
      favicon.href = settings.appearance.branding.favicon;
    } else {
      // Si no existe el favicon, crear uno nuevo
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/jpeg';
      link.href = settings.appearance.branding.favicon;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      applySettings(settings);
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }, [settings, applySettings]);
  const loadSettings = async () => {
    try {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
      } else {
        setSettings(defaultSettings);
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      logger.error('Error loading settings:', error);
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };

      setSettings(updatedSettings);

      return true;
    } catch (error) {
      logger.error('Error updating settings:', error);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSettings, applySettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};