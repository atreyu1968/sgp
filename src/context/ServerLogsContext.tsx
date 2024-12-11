import React, { createContext, useContext, useState, useEffect } from 'react';
import { systemApi } from '../services/api/system';
import { LogEntry } from '../types/logger';

interface ServerLogsContextType {
  logs: LogEntry[];
  isLoading: boolean;
  error: string | null;
  clearLogs: () => Promise<void>;
  refreshLogs: () => Promise<void>;
}

const ServerLogsContext = createContext<ServerLogsContextType | undefined>(undefined);

export const ServerLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await systemApi.getLogs();
      setLogs(response.logs || []);
    } catch (err) {
      setError('Error fetching server logs');
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = async () => {
    try {
      await systemApi.clearLogs();
      setLogs([]);
    } catch (err) {
      setError('Error clearing logs');
      console.error('Error clearing logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Set up polling for log updates
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ServerLogsContext.Provider value={{
      logs,
      isLoading,
      error,
      clearLogs,
      refreshLogs: fetchLogs
    }}>
      {children}
    </ServerLogsContext.Provider>
  );
};

export const useServerLogs = () => {
  const context = useContext(ServerLogsContext);
  if (context === undefined) {
    throw new Error('useServerLogs must be used within a ServerLogsProvider');
  }
  return context;
};