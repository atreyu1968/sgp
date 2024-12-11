export interface ConnectionStatus {
  isConnected: boolean;
  lastCheck: Date;
  error?: string;
}

export interface ServerConnectionOptions {
  checkInterval?: number;
  retryTimeout?: number;
  maxRetries?: number;
}

export interface ServerConnection {
  getStatus(): ConnectionStatus;
  startChecking(): void;
  stopChecking(): void;
  onStatusChange(callback: (status: ConnectionStatus) => void): () => void;
  waitForConnection(timeout?: number): Promise<boolean>;
}