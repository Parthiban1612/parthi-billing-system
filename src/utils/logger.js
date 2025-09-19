/**
 * Production-safe logger utility
 * Removes console logs in production builds for better performance
 */

const isDevelopment = __DEV__;

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  // For critical errors that should always be logged
  critical: (...args) => {
    console.error(...args);
  },

  // For performance monitoring
  performance: (label, duration) => {
    if (isDevelopment) {
      console.log(`⏱️ ${label}: ${duration}ms`);
    }
  },

  // For API calls
  api: (method, url, status, duration) => {
    if (isDevelopment) {
      const statusColor = status >= 200 && status < 300 ? '🟢' : '🔴';
      console.log(`${statusColor} ${method} ${url} - ${status} (${duration}ms)`);
    }
  }
};

export default logger; 