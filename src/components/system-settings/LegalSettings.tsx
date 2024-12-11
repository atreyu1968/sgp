import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface LegalSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const LegalSettings: React.FC<LegalSettingsProps> = ({ onSave, isSaving }) => {
  const { settings, updateSettings } = useSettings();
  const [legalSettings, setLegalSettings] = useState({
    termsAndConditions: {
      content: settings?.legal?.termsAndConditions?.content || '',
      lastUpdated: settings?.legal?.termsAndConditions?.lastUpdated || new Date().toISOString()
    },
    privacyPolicy: {
      content: settings?.legal?.privacyPolicy?.content || '',
      lastUpdated: settings?.legal?.privacyPolicy?.lastUpdated || new Date().toISOString()
    }
  });

  const handleContentChange = (type: 'termsAndConditions' | 'privacyPolicy', content: string) => {
    setLegalSettings(prev => ({
      ...prev,
      [type]: {
        content,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const handleSave = async () => {
    const newSettings = {
      legal: legalSettings
    };

    await updateSettings(newSettings);
    if (onSave) {
      await onSave(newSettings);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Documentos Legales</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Términos y Condiciones</h4>
            <textarea
              value={legalSettings.termsAndConditions.content}
              onChange={(e) => handleContentChange('termsAndConditions', e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Introduce los términos y condiciones..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Última actualización: {new Date(legalSettings.termsAndConditions.lastUpdated).toLocaleDateString('es-ES')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Política de Privacidad</h4>
            <textarea
              value={legalSettings.privacyPolicy.content}
              onChange={(e) => handleContentChange('privacyPolicy', e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Introduce la política de privacidad..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Última actualización: {new Date(legalSettings.privacyPolicy.lastUpdated).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
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

export default LegalSettings;