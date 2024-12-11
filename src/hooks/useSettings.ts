import { useState, useEffect } from 'react';
import { Settings } from '../types/settings';
import { settingsService } from '../services/settingsService';
import { useToast } from './useToast';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      showToast('Error al cargar la configuración', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = await settingsService.updateSettings(newSettings);
      setSettings(updatedSettings);
      showToast('Configuración actualizada correctamente', 'success');
      return true;
    } catch (error) {
      showToast('Error al actualizar la configuración', 'error');
      return false;
    }
  };

  const createBackup = async () => {
    try {
      const backup = await settingsService.createBackup();
      const url = window.URL.createObjectURL(backup);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Copia de seguridad creada correctamente', 'success');
    } catch (error) {
      showToast('Error al crear la copia de seguridad', 'error');
    }
  };

  const restoreBackup = async (file: File) => {
    try {
      await settingsService.restoreBackup(file);
      await loadSettings();
      showToast('Copia de seguridad restaurada correctamente', 'success');
      return true;
    } catch (error) {
      showToast('Error al restaurar la copia de seguridad', 'error');
      return false;
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    createBackup,
    restoreBackup,
  };
};