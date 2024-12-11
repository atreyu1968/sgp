import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

type ViewMode = 'grid' | 'list';
type ViewSection = 'projects' | 'users' | 'convocatorias';

export const useViewMode = (section: ViewSection) => {
  const { settings } = useSettings();
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Changed default to 'list'

  useEffect(() => {
    // Only apply default view if no saved preference
    const savedView = localStorage.getItem(`viewMode_${section}`);
    if (!savedView && settings?.views?.defaultViews?.[section]) {
      setViewMode(settings.views.defaultViews[section]);
    } else if (savedView) {
      setViewMode(savedView as ViewMode);
    }
  }, [settings, section]);

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(`viewMode_${section}`, mode);
  };

  return { viewMode, changeViewMode };
};