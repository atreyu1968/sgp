import React, { useState, useEffect } from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface ReviewSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const ReviewSettings: React.FC<ReviewSettingsProps> = ({ onSave, isSaving }) => {
  const { settings, updateSettings } = useSettings();
  const [reviewSettings, setReviewSettings] = useState({
    allowAdminReview: false,
    allowCoordinatorReview: false
  });

  useEffect(() => {
    if (settings?.reviews) {
      setReviewSettings({
        allowAdminReview: settings.reviews.allowAdminReview || false,
        allowCoordinatorReview: settings.reviews.allowCoordinatorReview || false
      });
    }
  }, [settings]);

  const handleToggle = async (setting: string) => {
    const newSettings = {
      ...reviewSettings,
      [setting]: !reviewSettings[setting as keyof typeof reviewSettings]
    };
    
    setReviewSettings(newSettings);

    const updatedSettings = {
      reviews: newSettings
    };

    await updateSettings(updatedSettings);
    if (onSave) {
      await onSave(updatedSettings);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <CheckSquare className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Correcciones</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Permitir correcciones del administrador</p>
              <p className="text-sm text-gray-500">
                El administrador podrá realizar correcciones y será añadido automáticamente como corrector
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reviewSettings.allowAdminReview}
                onChange={() => handleToggle('allowAdminReview')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Permitir correcciones del coordinador</p>
              <p className="text-sm text-gray-500">
                El coordinador podrá realizar correcciones y será añadido automáticamente como corrector
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reviewSettings.allowCoordinatorReview}
                onChange={() => handleToggle('allowCoordinatorReview')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onSave({ reviews: reviewSettings })}
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

export default ReviewSettings;