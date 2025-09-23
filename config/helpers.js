import AppConfig from './index';

// Helper functions for configuration
export const getApiUrl = () => AppConfig.api.baseUrl;
export const getApiKey = () => AppConfig.api.apiKey;
export const getApiTimeout = () => AppConfig.api.timeout;
export const getRetryAttempts = () => AppConfig.api.retryAttempts;

// App helpers
export const getAppName = () => AppConfig.app.name;
export const getAppVersion = () => AppConfig.app.version;
export const getEnvironment = () => AppConfig.app.environment;
export const getBundleId = () => AppConfig.app.bundleId;

// Feature flag helpers
export const isAnalyticsEnabled = () => AppConfig.features.analyticsEnabled;
export const isCrashReportingEnabled = () => AppConfig.features.crashReportingEnabled;
export const isNewFeatureEnabled = () => AppConfig.features.newFeatureEnabled;
export const isDebugMode = () => AppConfig.features.debugMode;

// Service helpers
export const getGoogleMapsApiKey = () => AppConfig.services.googleMapsApiKey;
export const getGoogleAnalyticsId = () => AppConfig.services.googleAnalyticsId;
export const getSentryDsn = () => AppConfig.services.sentryDsn;
export const getFirebaseConfig = () => AppConfig.services.firebase;

// Zoho Sales helpers
export const getZohoSalesAppKey = () => AppConfig.services.zoho.salesAppKey;
export const getZohoSalesIqAccessKey = () => AppConfig.services.zoho.salesIqAccessKey;
export const getZohoConfig = () => AppConfig.services.zoho;

// Payment helpers
export const getRazorpayTestKey = () => AppConfig.payment.razorpayTestKey;
export const getRazorpayLiveKey = () => AppConfig.payment.razorpayLiveKey;

// Environment helpers
export const isDevelopment = () => AppConfig.isDev;
export const isStaging = () => AppConfig.isStaging;
export const isProduction = () => AppConfig.isProd;

// Logging helper
export const logConfig = () => {
  if (isDebugMode()) {
    console.log('App Configuration:', {
      environment: getEnvironment(),
      apiUrl: getApiUrl(),
      debugMode: isDebugMode(),
      analyticsEnabled: isAnalyticsEnabled(),
      crashReportingEnabled: isCrashReportingEnabled(),
      zohoEnabled: !!getZohoSalesAppKey()
    });
  }
};
