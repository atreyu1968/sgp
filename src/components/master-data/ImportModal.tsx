import React, { useState, useRef } from 'react';
import { X, Upload, Download, AlertCircle, Loader2 } from 'lucide-react';
import { MasterDataType, ImportResult } from '../../types/master';
import { generateTemplate } from '../../services/masterDataService';

interface ImportModalProps {
  type: MasterDataType;
  onClose: () => void;
  onImport: (file: File) => Promise<ImportResult>;
}

const ImportModal: React.FC<ImportModalProps> = ({
  type,
  onClose,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx')) {
        alert('Por favor, selecciona un archivo Excel (.xlsx)');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateTemplate(type);
    const url = window.URL.createObjectURL(template);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template_${type}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    try {
      const importResult = await onImport(file);
      setResult(importResult);
      if (importResult.success) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        totalRows: 0,
        successCount: 0,
        errorCount: 1,
        errors: [{
          row: 0,
          field: '',
          message: error instanceof Error ? error.message : 'Error desconocido'
        }]
      });
    } finally {
      setIsImporting(false);
    }
  };

  const getTypeLabel = (type: MasterDataType): string => {
    const labels: Record<MasterDataType, string> = {
      centers: 'centros educativos',
      families: 'familias profesionales',
      cycles: 'ciclos formativos',
      courses: 'cursos'
    };
    return labels[type];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full mx-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Importar {getTypeLabel(type)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Antes de importar
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Descarga la plantilla Excel</li>
                    <li>Rellena los datos siguiendo el formato</li>
                    <li>No modifiques las columnas de la plantilla</li>
                    <li>Guarda el archivo en formato .xlsx</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadTemplate}
            className="w-full mb-6 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download size={20} />
            <span>Descargar plantilla</span>
          </button>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500"
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Seleccionar archivo</span>
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">
                  Solo archivos Excel (.xlsx)
                </p>
              </div>
            </button>

            {file && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-900">{file.name}</span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex">
                <div className={`flex-shrink-0 ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Importación completada' : 'Error en la importación'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <p>Total de registros: {result.totalRows}</p>
                    <p>Importados correctamente: {result.successCount}</p>
                    <p>Errores: {result.errorCount}</p>
                    {result.errors.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {result.errors.map((error, index) => (
                          <li key={index}>
                            Fila {error.row}: {error.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isImporting}
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isImporting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload size={20} />
            )}
            <span>{isImporting ? 'Importando...' : 'Importar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;