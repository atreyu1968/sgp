import { SERVER_CONFIG } from '../config';

class ServerMonitor {
  private static instance: ServerMonitor;
  private isServerRunning: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private retryInterval: number = 2000;
  private listeners: Array<(status: boolean) => void> = [];
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.checkServerStatus();
    // Check server status every 30 seconds
    this.checkInterval = setInterval(() => this.checkServerStatus(), 30000);
  }

  static getInstance(): ServerMonitor {
    if (!ServerMonitor.instance) {
      ServerMonitor.instance = new ServerMonitor();
    }
    return ServerMonitor.instance;
  }

  private async checkServerStatus(): Promise<void> {
    try {
      const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api/health`);
      const newStatus = response.ok;
      
      if (this.isServerRunning !== newStatus) {
        this.isServerRunning = newStatus;
        this.notifyListeners();
      }
      
      this.retryCount = 0; // Reset retry count on successful connection
    } catch (error) {
      if (this.isServerRunning) {
        this.isServerRunning = false;
        this.notifyListeners();
      }
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying server connection (${this.retryCount}/${this.maxRetries})...`);
        setTimeout(() => this.checkServerStatus(), this.retryInterval);
      } else {
        console.error('Server connection failed after maximum retries');
      }
    }
  }

  public getServerStatus(): boolean {
    return this.isServerRunning;
  }

  public onStatusChange(callback: (status: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.isServerRunning));
  }

  public async waitForServer(): Promise<void> {
    if (this.isServerRunning) return;

    return new Promise((resolve) => {
      const unsubscribe = this.onStatusChange((status) => {
        if (status) {
          unsubscribe();
          resolve();
        }
      });
    });
  }

  public cleanup(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.listeners = [];
  }
}

export const serverMonitor = ServerMonitor.getInstance();