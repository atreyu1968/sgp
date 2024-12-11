import React, { useRef, useState } from 'react';
import { Download, Upload, RefreshCw, Check, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';

interface Convocatoria {
  id: string;
  title: string;
}

const BackupSettings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastBackup, setLastBackup] = useState<string | null>('2024-03-15 10:30:00');
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<string>('');

  // Mock data - Replace with API call
  const convocatorias: Convocatoria[] = [
    { id: '1', title: 'Convocatoria 2024' },
    { id: '2', title: 'Convocatoria 2023' },
    { id: '3', title: 'Convocatoria 2022' }
  ];

  const handleBackup = async () => {
    if (!selectedConvocatoria) {
      alert('Por favor, selecciona una convocatoria');
      return;
    }

    try {
      // Mock data - Replace with API call
      const backupData = {
        convocatoria: convocatorias.find(c => c.id === selectedConvocatoria),
        projects: [],
        users: [],
        settings: {}
      };

      const zip = new JSZip();
      zip.file('backup.json', JSON.stringify(backupData, null, 2));

      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${selectedConvocatoria}-${new Date().toISOString()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error al crear la copia de seguridad');
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const backupFile = contents.file('backup.json');
      
      if (!backupFile) {
        throw new Error('Archivo de backup no válido');
      }

      const backupData = JSON.parse(await backupFile.async('string'));
      // TODO: Implement restore API call
      console.log('Restoring backup...', backupData);
      
      setRestoreStatus('success');
      setTimeout(() => setRestoreStatus('idle'), 3000);
    } catch (error) {
      console.error('Error restoring backup:', error);
      setRestoreStatus('error');
      setTimeout(() => setRestoreStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Copias de Seguridad</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Seleccionar convocatoria</h4>
              <select
                value={selectedConvocatoria}
                onChange={(e) => setSelectedConvocatoria(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona una convocatoria</option>
                {convocatorias.map(conv => (
                  <option key={conv.id} value={conv.id}>{conv.title}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleBackup}
              disabled={!selectedConvocatoria}
              className={`ml-4 flex items-center space-x-2 px-4 py-2 rounded-lg ${
                selectedConvocatoria
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download size={20} />
              <span>Descargar copia</span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Restaurar copia de seguridad</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona un archivo ZIP de copia de seguridad para restaurar
                </p>
              </div>
              {lastBackup && (
                <div className="text-sm text-gray-500">
                  Última copia: {lastBackup}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload size={20} />
                <span>Seleccionar archivo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleRestore}
                className="hidden"
              />

              {restoreStatus === 'success' && (
                <div className="flex items-center text-green-600">
                  <Check size={20} className="mr-2" />
                  <span>Restauración completada</span>
                </div>
              )}

              {restoreStatus === 'error' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle size={20} className="mr-2" />
                  <span>Error al restaurar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;