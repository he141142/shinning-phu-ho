import { RequestConfig } from "./type";

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};


class ApiLogger {
  private enabled: boolean;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  private log(level: keyof LogLevel, message: string, data?: unknown) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [API] ${message}`;

    switch (level) {
      case 'ERROR':
        console.error(logMessage, data);
        break;
      case 'WARN':
        console.warn(logMessage, data);
        break;
      case 'INFO':
        console.info(logMessage, data);
        break;
      case 'DEBUG':
        console.debug(logMessage, data);
        break;
    }
  }

  logRequest(method: string, url: string, config?: RequestConfig) {
    this.log('INFO', `→ ${method} ${url}`, {
      headers: config?.headers,
      timeout: config?.timeout,
      retryAttempts: config?.retryAttempts,
    });
  }

  logResponse(method: string, url: string, status: number, duration: number) {
    this.log('INFO', `← ${method} ${url} ${status} (${duration}ms)`);
  }

  logError(method: string, url: string, error: Error, attempt?: number) {
    this.log('ERROR', `✗ ${method} ${url}${attempt ? ` (attempt ${attempt})` : ''}`, {
      error: error.message,
      stack: error.stack,
    });
  }

  logRetry(method: string, url: string, attempt: number, delay: number) {
    this.log('WARN', `⟲ ${method} ${url} - Retry ${attempt} after ${delay}ms`);
  }

  debug(message: string, data?: unknown) {
    this.log('DEBUG', message, data);
  }
};

export const apiLogger = new ApiLogger(true);
