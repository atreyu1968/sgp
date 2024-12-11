import React, { useState, useRef } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useSettings } from '../../context/SettingsContext';

interface AppearanceSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onSave, isSaving }) => {
  const { settings, updateSettings } = useSettings();
  const [branding, setBranding] = useState(settings?.appearance?.branding || {
    logo: '',
    appName: 'FP Innova',
    favicon: '',
  });

  const [colors, setColors] = useState(settings?.appearance?.colors || {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#3b82f6',
    headerBg: '#1e3a8a',
    sidebarBg: '#f0f9ff',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding(prev => ({ ...prev, favicon: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (key: keyof typeof colors) => (color: string) => {
    setColors(prev => ({ ...prev, [key]: color }));
  };

  const handleSave = async () => {
    const newSettings = {
      appearance: {
        branding,
        colors,
      },
    };

    await updateSettings(newSettings);
    if (onSave) {
      await onSave(newSettings);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Marca</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="flex items-center space-x-4">
              {branding.logo && (
                <img
                  src={branding.logo}
                  alt="Logo actual"
                  className="h-12 object-contain"
                />
              )}
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="btn btn-secondary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir logo
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la aplicación
            </label>
            <input
              type="text"
              value={branding.appName}
              onChange={(e) => setBranding(prev => ({ ...prev, appName: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favicon
            </label>
            <div className="flex items-center space-x-4">
              {branding.favicon && (
                <img
                  src={branding.favicon}
                  alt="Favicon actual"
                  className="h-8 w-8 object-contain"
                />
              )}
              <button
                type="button"
                onClick={() => faviconInputRef.current?.click()}
                className="btn btn-secondary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir favicon
              </button>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*"
                onChange={handleFaviconUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Colores</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color primario
            </label>
            <ColorPicker
              color={colors.primary}
              onChange={handleColorChange('primary')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color secundario
            </label>
            <ColorPicker
              color={colors.secondary}
              onChange={handleColorChange('secondary')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de acento
            </label>
            <ColorPicker
              color={colors.accent}
              onChange={handleColorChange('accent')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de fondo del encabezado
            </label>
            <ColorPicker
              color={colors.headerBg}
              onChange={handleColorChange('headerBg')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de fondo de la barra lateral
            </label>
            <ColorPicker
              color={colors.sidebarBg}
              onChange={handleColorChange('sidebarBg')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de texto primario
            </label>
            <ColorPicker
              color={colors.textPrimary}
              onChange={handleColorChange('textPrimary')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de texto secundario
            </label>
            <ColorPicker
              color={colors.textSecondary}
              onChange={handleColorChange('textSecondary')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
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

export default AppearanceSettings;