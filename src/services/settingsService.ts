import { Settings } from '../types/settings';

class SettingsService {
  private static instance: SettingsService;
  private settings: Settings | null = null;
  private persistenceTimeout: NodeJS.Timeout | null = null;
  private subscribers: Array<(settings: Settings) => void> = [];

  private constructor() {
    // Intentar cargar configuración del localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
      this.applySettings(this.settings);
    }
  }

  private applySettings(settings: Settings) {
    if (!settings) return;
    
    // Aplicar colores al root
    const root = document.documentElement;
    Object.entries(settings.appearance.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Actualizar título y favicon
    document.title = settings.appearance.branding.appName;
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon && settings.appearance.branding.favicon) {
      favicon.href = settings.appearance.branding.favicon;
    }

    // Notificar a los suscriptores
    this.notifySubscribers();
  }

  private notifySubscribers() {
    if (!this.settings) return;
    this.subscribers.forEach(callback => callback(this.settings!));
  }

  private schedulePersistence() {
    if (this.persistenceTimeout) {
      clearTimeout(this.persistenceTimeout);
    }
    
    this.persistenceTimeout = setTimeout(() => {
      if (this.settings) {
        localStorage.setItem('appSettings', JSON.stringify(this.settings));
      }
    }, 1000); // Debounce de 1 segundo
  }

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async getSettings(): Promise<Settings> {
    if (!this.settings) {
      // Configuración por defecto
      this.settings = {
        general: {
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
        },
        appearance: {
          branding: {
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Logotipo_del_Gobierno_de_Canarias.svg/2560px-Logotipo_del_Gobierno_de_Canarias.svg.png',
            appName: 'FP Innova',
            favicon: 'https://www3.gobiernodecanarias.org/medusa/mediateca/ecoescuela/wp-content/uploads/sites/2/2013/11/favicon-Gobierno-de-Canarias.png',
          },
          colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#3b82f6',
            headerBg: '#1e3a8a',
            sidebarBg: '#f0f9ff',
            textPrimary: '#111827',
            textSecondary: '#4b5563',
          },
        },
        views: {
          defaultViews: {
            projects: 'grid',
            users: 'grid',
            convocatorias: 'grid',
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
        integrations: {
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
          },
          analytics: {
            enabled: false,
            trackingId: '',
          },
        },
      };

      // Save default settings to localStorage
      this.schedulePersistence();
      this.applySettings(this.settings);
    }
    return Promise.resolve(this.settings);
  }

  async updateSettings(newSettings: Partial<Settings>): Promise<Settings> {
    this.settings = {
      ...this.settings!,
      ...newSettings,
    };

    // Guardar en localStorage
    this.schedulePersistence();
    this.applySettings(this.settings);

    return Promise.resolve(this.settings);
  }

  subscribe(callback: (settings: Settings) => void): () => void {
    this.subscribers.push(callback);
    if (this.settings) {
      callback(this.settings);
    }
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  async createBackup(): Promise<Blob> {
    const backup = JSON.stringify(this.settings, null, 2);
    return new Blob([backup], { type: 'application/json' });
  }

  async restoreBackup(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          await this.updateSettings(backup);
          this.applySettings(this.settings);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
}

export const settingsService = SettingsService.getInstance();