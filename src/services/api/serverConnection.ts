import { SERVER_CONFIG } from '../../config';
import { logger } from '../../utils/logger';

interface ConnectionStatus {
  isConnected: boolean;
  lastCheck: Date;
  error?: string;
}

class ServerConnection {
  private static instance: ServerConnection;
  private status: ConnectionStatus = {
    isConnected: false,
    lastCheck: new Date()
  };
  private checkInterval: number = 30000; // 30 seconds
  private retryTimeout: number = 5000;  // 5 seconds
  private maxRetries: number = 3;
  private currentRetries: number = 0;
  private intervalId?: NodeJS.Timeout;
  private listeners: Array<(status: ConnectionStatus) => void> = [];

  private constructor() {
    this.startChecking();
  }

  static getInstance(): ServerConnection {
    if (!ServerConnection.instance) {
      ServerConnection.instance = new ServerConnection();
    }
    return ServerConnection.instance;
  }

  private async checkConnection(): Promise<boolean> {
    try {
      logger.debug('Checking server connection...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const isConnected = response.ok;
      logger.debug(`Server connection check result: ${isConnected}`);
      return isConnected;

    } catch (error) {
      // Don't log abort errors as they're expected
      if (error instanceof Error && error.name !== 'AbortError') {
        const errorMessage = error.message || 'Unknown error';
        logger.error('Server connection check failed', { error: errorMessage });
      }
      logger.error('Server connection check failed', { error: errorMessage });
      return false;
    }
  }

  private async performCheck() {
    logger.debug('Performing connection check...');

    // Reset retries if we've been connected before
    if (this.status.isConnected) {
      this.currentRetries = 0;
    }

    const isConnected = await this.checkConnection();
    const newStatus: ConnectionStatus = {
      isConnected,
      lastCheck: new Date()
    };

    if (!isConnected) {
      const errorMessage = 'No se pudo conectar con el servidor';
      newStatus.error = errorMessage;
      
      if (this.currentRetries < this.maxRetries) {
        this.currentRetries++;
        // Only log first retry attempt to reduce noise
        if (this.currentRetries === 1) {
          logger.warn('Connection retry initiated', {
            maxRetries: this.maxRetries
          });
        }
        setTimeout(() => this.performCheck(), this.retryTimeout);
      } else {
        logger.error('Connection failed after max retries', {
          attempts: this.maxRetries,
          lastError: errorMessage
        });
        // Reset retries for next check interval
        this.currentRetries = 0;
      }
    } else {
      this.currentRetries = 0;
      // Only log connection established if we were previously disconnected
      if (!this.status.isConnected) {
        logger.info('Server connection established');
      }
    }

    this.updateStatus(newStatus);
  }

  private updateStatus(newStatus: ConnectionStatus) {
    const oldStatus = this.status;
    this.status = newStatus;
    
    if (oldStatus.isConnected !== newStatus.isConnected) {
      logger.info('Connection status changed', {
        from: oldStatus.isConnected,
        to: newStatus.isConnected
      });
    }

    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  public startChecking() {
    logger.info('Starting server connection monitoring');
    this.performCheck();
    this.intervalId = setInterval(() => this.performCheck(), this.checkInterval);
  }

  public stopChecking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      logger.info('Stopped server connection monitoring');
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

export const serverConnection = ServerConnection.getInstance();