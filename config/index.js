import Config from 'react-native-config';

const AppConfig = {
  // API Configuration
  api: {
    baseUrl: Config.API_URL || 'https://mapi.trundle.me',
    timeout: parseInt(Config.API_TIMEOUT) || 10000,
    retryAttempts: parseInt(Config.API_RETRY_ATTEMPTS) || 3,
    apiKey: Config.API_KEY || 'S0HU1TJi.YN1ikR4PcO9bLM5BcaZh8qRuhHTXBZZc'
  },

  // App Settings
  app: {
    name: Config.APP_NAME || 'Trundle',
    version: Config.APP_VERSION || '1.0.0',
    environment: Config.ENVIRONMENT || 'development',
    bundleId: Config.BUNDLE_ID || 'com.parthi_1612.trudleai'
  },

  // Feature Flags
  features: {
    analyticsEnabled: Config.ENABLE_ANALYTICS === 'true',
    crashReportingEnabled: Config.ENABLE_CRASH_REPORTING === 'true',
    newFeatureEnabled: Config.ENABLE_NEW_FEATURE === 'true',
    debugMode: Config.DEBUG_MODE === 'true'
  },

  // Third-party Services
  services: {
    googleMapsApiKey: Config.GOOGLE_MAPS_API_KEY,
    googleAnalyticsId: Config.GOOGLE_ANALYTICS_ID,
    sentryDsn: Config.SENTRY_DSN,
    firebase: {
      projectId: Config.FIREBASE_PROJECT_ID || 'trundle-59e63',
      storageBucket: Config.FIREBASE_STORAGE_BUCKET || 'trundle-59e63.firebasestorage.app',
      appId: Config.FIREBASE_APP_ID || '1:625287918130:android:9c9953e166bd4186d6022b'
    },
    zoho: {
      salesAppKey: Config.ZOHO_SALES_APP_KEY || 'ocrGIIxqgug8FF0dQm7f2f%2FusB50z0o%2BWxgZVVM343lA8Y2Lq4ARzJwRFZvKZPXB_in',
      salesIqAccessKey: Config.ZOHO_SALES_IQ_ACCESS_KEY || 'kZb1TZ%2BPa80lPz7je7NdJsjhwzzB5R5PM2V4l7R4sB1J39m2ToTfN1NVTeiJTOo8Pp7GHlCcuyzfjLoygJeY3FtJsYqGJHLrXc6eqNkUY6RctNbvSOUicc32muET%2BMtd'
    }
  },

  // Payment Configuration
  payment: {
    razorpayTestKey: Config.RZP_TEST_KEY || 'rzp_test_rwwI0xDFigS3Fz',
    razorpayLiveKey: Config.RZP_LIVE_KEY
  },

  // Development helpers
  isDev: Config.ENVIRONMENT === 'development',
  isStaging: Config.ENVIRONMENT === 'staging',
  isProd: Config.ENVIRONMENT === 'production'
};

export default AppConfig;
