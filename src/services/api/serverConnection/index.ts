import { SERVER_CONFIG } from '../../../config';
import { logger } from '../../../utils/logger';
import { ConnectionStatus, ServerConnection, ServerConnectionOptions } from './types';

class ServerConnectionImpl implements ServerConnection {
  private static instance: ServerConnectionImpl;
  private status: ConnectionStatus = {
    isConnected: false,
    lastCheck: new Date()
  };
  private checkInterval: number;
  private retryTimeout: number;
  private maxRetries: number;
  private currentRetries: number = 0;
  private intervalId?: NodeJS.Timeout;
  private listeners: Array<(status: ConnectionStatus) => void> = [];

  private constructor(options: ServerConnectionOptions = {}) {
    this.checkInterval = options.checkInterval || 30000; // 30 seconds
    this.retryTimeout = options.retryTimeout || 5000;   // 5 seconds
    this.maxRetries = options.maxRetries || 3;
    this.startChecking();
  }

  static getInstance(options?: ServerConnectionOptions): ServerConnection {
    if (!ServerConnectionImpl.instance) {
      ServerConnectionImpl.instance = new ServerConnectionImpl(options);
    }
    return ServerConnectionImpl.instance;
  }

  private async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      logger.error('Server connection check failed:', error);
      return false;
    }
  }

  private async performCheck() {
    const isConnected = await this.checkConnection();
    const newStatus: ConnectionStatus = {
      isConnected,
      lastCheck: new Date()
    };

    if (!isConnected) {
      newStatus.error = 'No se pudo conectar con el servidor';
      
      if (this.currentRetries < this.maxRetries) {
        this.currentRetries++;
        logger.warn(`Retry attempt ${this.currentRetries}/${this.maxRetries}`);
        setTimeout(() => this.performCheck(), this.retryTimeout);
      } else {
        logger.error('Max retries reached, server connection failed');
      }
    } else {
      this.currentRetries = 0;
    }

    this.updateStatus(newStatus);
  }

  private updateStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  public startChecking() {
    this.performCheck();
    this.intervalId = setInterval(() => this.performCheck(), this.checkInterval);
  }

  public stopChecking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  public onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public async waitForConnection(timeout: number = 30000): Promise<boolean> {
    if (this.status.isConnected) return true;

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, timeout);

      const unsubscribe = this.onStatusChange((status) => {
        if (status.isConnected) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(true);
        }
      });
    });
  }
}

export const serverConnection = ServerConnectionImpl.getInstance();