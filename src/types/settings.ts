// ... (código anterior)

export interface LegalSettings {
  termsAndConditions: {
    lastUpdated: string;
    content: string;
  };
  privacyPolicy: {
    lastUpdated: string;
    content: string;
  };
}

export interface Settings {
  general: {
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    defaultLanguage: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    systemEmails: {
      from: string;
      replyTo: string;
    };
  };
  appearance: {
    branding: {
      logo: string;
      appName: string;
      favicon: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      headerBg: string;
      sidebarBg: string;
      textPrimary: string;
      textSecondary: string;
    };
  };
  views: {
    defaultViews: {
      projects: 'grid' | 'list';
      users: 'grid' | 'list';
      convocatorias: 'grid' | 'list';
    };
    displayOptions: {
      showDescription: boolean;
      showMetadata: boolean;
      showThumbnails: boolean;
      itemsPerPage: number;
    };
    dashboardLayout: {
      showStats: boolean;
      showRecentActivity: boolean;
      showUpcomingDeadlines: boolean;
      showQuickActions: boolean;
    };
  };
  reviews: {
    allowAdminReview: boolean;
    allowCoordinatorReview: boolean;
  };
  legal: LegalSettings;
}