import React, { createContext, useContext, useEffect, useState } from 'react';
import { serverConnection } from '../services/api/serverConnection';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface ServerStatus {
  isConnected: boolean;
  lastCheck: Date;
  error?: string;
}

interface ServerStatusContextType {
  status: ServerStatus;
  waitForConnection: (timeout?: number) => Promise<boolean>;
}

const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ServerStatus>(serverConnection.getStatus());
  const [showError, setShowError] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const unsubscribe = serverConnection.onStatusChange((newStatus) => {
      setStatus(newStatus);
      setShowError(!newStatus.isConnected);
    });

    return () => {
      unsubscribe();
      serverConnection.stopChecking();
    };
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    setShowError(false);
    
    try {
      const connected = await serverConnection.waitForConnection(5000);
      if (!connected) {
        setShowError(true);
      }
    } finally {
      setRetrying(false);
    }
  };

  if (!status.isConnected) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 space-y-4">
          {showError ? (
            <div className="space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900">
                Error de Conexión
              </h2>
              <p className="text-gray-600">
                No se pudo establecer conexión con el servidor. 
                {status.error && (
                  <span className="block mt-2 text-sm text-red-600">
                    {status.error}
                  </span>
                )}
              </p>
              <div className="mt-6">
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {retrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reintentar conexión
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Último intento: {status.lastCheck.toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
              <p className="text-gray-600 animate-pulse">
                Conectando con el servidor...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ServerStatusContext.Provider value={{ 
      status,
      waitForConnection: serverConnection.waitForConnection.bind(serverConnection)
    }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (context === undefined) {
    throw new Error('useServerStatus must be used within a ServerStatusProvider');
  }
  return context;
};