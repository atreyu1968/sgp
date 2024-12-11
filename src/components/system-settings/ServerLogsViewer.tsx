import React, { useState } from 'react';
import { Terminal, RefreshCw, Trash2, Download, Filter, Search, Loader2, AlertCircle } from 'lucide-react';
import { useServerLogs } from '../../context/ServerLogsContext';

const ServerLogsViewer: React.FC = () => {
  const { logs, isLoading, error, clearLogs, refreshLogs } = useServerLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleExport = () => {
    const logText = filteredLogs
      .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `server-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Terminal className="text-gray-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Logs del Servidor</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshLogs}
              className="btn btn-secondary flex items-center space-x-2"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <button
              onClick={clearLogs}
              className="btn btn-secondary flex items-center space-x-2"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpiar</span>
            </button>
            <button
              onClick={handleExport}
              className="btn btn-secondary flex items-center space-x-2"
              disabled={isLoading}
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar en los logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los niveles</option>
            <option value="info">Info</option>
            <option value="warn">Advertencias</option>
            <option value="error">Errores</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-actualizar</span>
          </label>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-4 h-[600px] overflow-y-auto font-mono text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No hay logs para mostrar
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.level === 'error' ? 'bg-red-900/20 text-red-300' :
                    log.level === 'warn' ? 'bg-yellow-900/20 text-yellow-300' :
                    'bg-gray-800/40 text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                  <span className={`font-semibold ${
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warn' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    [{log.level.toUpperCase()}]
                  </span>{' '}
                  <span>{log.message}</span>
                  {log.details && (
                    <pre className="mt-1 text-xs text-gray-400 overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerLogsViewer;