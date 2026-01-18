export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Determine log level based on environment
const CURRENT_LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'WARN' : 'DEBUG';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  function: string;
  message: string;
  context?: any;
}

export class Logger {
  private moduleName: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  private log(level: LogLevel, functionName: string, message: string, context?: any) {
    if (LOG_LEVELS[level] < LOG_LEVELS[CURRENT_LOG_LEVEL]) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.moduleName,
      function: functionName,
      message,
      context: this.sanitizeContext(context),
    };

    // Output as JSON string for structured logging
    if (level === 'ERROR') {
      console.error(JSON.stringify(logEntry));
    } else if (level === 'WARN') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  // Helper to handle circular references or large objects if needed
  private sanitizeContext(context: any): any {
    if (context === undefined || context === null) return context;
    try {
        // Simple serialization check
        JSON.stringify(context);
        return context;
    } catch (e) {
        return '[Circular or Non-Serializable Data]';
    }
  }

  debug(functionName: string, message: string, context?: any) {
    this.log('DEBUG', functionName, message, context);
  }

  info(functionName: string, message: string, context?: any) {
    this.log('INFO', functionName, message, context);
  }

  warn(functionName: string, message: string, context?: any) {
    this.log('WARN', functionName, message, context);
  }

  error(functionName: string, message: string, error?: any) {
    let errorContext = error;
    if (error instanceof Error) {
      errorContext = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      };
    }
    this.log('ERROR', functionName, message, errorContext);
  }
}

export const createLogger = (moduleName: string) => new Logger(moduleName);
