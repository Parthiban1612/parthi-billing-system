# Configuration System

This directory contains the configuration system for the Trundle mobile app. The configuration is environment-based and uses `react-native-config` to manage environment variables.

## Files

- `index.js` - Main configuration file that exports the AppConfig object
- `helpers.js` - Helper functions for accessing configuration values
- `README.md` - This documentation file

## Environment Files

The following environment files should be created in the project root:

- `.env` - Default/development environment
- `.env.development` - Development environment
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

## Usage

### Basic Usage

```javascript
import AppConfig from '../config';

// Access configuration values
const apiUrl = AppConfig.api.baseUrl;
const isDebug = AppConfig.features.debugMode;
const environment = AppConfig.app.environment;
```

### Using Helper Functions

```javascript
import { getApiUrl, isDebugMode, logConfig } from '../config/helpers';

// Get API URL
const apiUrl = getApiUrl();

// Check if debug mode is enabled
if (isDebugMode()) {
  console.log('Debug mode is enabled');
}

// Log configuration (only in debug mode)
logConfig();
```

### Environment Detection

```javascript
import { isDevelopment, isStaging, isProduction } from '../config/helpers';

if (isDevelopment()) {
  // Development-specific code
} else if (isStaging()) {
  // Staging-specific code
} else if (isProduction()) {
  // Production-specific code
}
```

## Configuration Structure

The configuration object has the following structure:

```javascript
{
  api: {
    baseUrl: string,
    timeout: number,
    retryAttempts: number,
    apiKey: string
  },
  app: {
    name: string,
    version: string,
    environment: string,
    bundleId: string
  },
  features: {
    analyticsEnabled: boolean,
    crashReportingEnabled: boolean,
    newFeatureEnabled: boolean,
    debugMode: boolean
  },
  services: {
    googleMapsApiKey: string,
    googleAnalyticsId: string,
    sentryDsn: string,
    firebase: {
      projectId: string,
      storageBucket: string,
      appId: string
    }
  },
  payment: {
    razorpayTestKey: string,
    razorpayLiveKey: string
  },
  isDev: boolean,
  isStaging: boolean,
  isProd: boolean
}
```

## Environment Variables

The following environment variables can be set in your `.env` files:

### API Configuration
- `API_URL` - Base API URL
- `API_TIMEOUT` - API timeout in milliseconds
- `API_RETRY_ATTEMPTS` - Number of retry attempts
- `API_KEY` - API key for authentication

### App Configuration
- `APP_NAME` - Application name
- `APP_VERSION` - Application version
- `ENVIRONMENT` - Environment (development/staging/production)
- `BUNDLE_ID` - Bundle identifier

### Feature Flags
- `ENABLE_ANALYTICS` - Enable/disable analytics
- `ENABLE_CRASH_REPORTING` - Enable/disable crash reporting
- `ENABLE_NEW_FEATURE` - Enable/disable new features
- `DEBUG_MODE` - Enable/disable debug mode

### Third-party Services
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `GOOGLE_ANALYTICS_ID` - Google Analytics ID
- `SENTRY_DSN` - Sentry DSN for error tracking
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `FIREBASE_APP_ID` - Firebase app ID

### Payment Configuration
- `RZP_TEST_KEY` - Razorpay test key
- `RZP_LIVE_KEY` - Razorpay live key

## Setup

1. Install the required dependency:
   ```bash
   npm install react-native-config
   ```

2. Create environment files in the project root with the appropriate values for each environment.

3. For iOS, you may need to add the following to your `ios/Trundle/Info.plist`:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLName</key>
       <string>config</string>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>$(API_URL)</string>
       </array>
     </dict>
   </array>
   ```

4. For Android, the configuration will be automatically available.

## Best Practices

1. Never commit sensitive information like API keys to version control
2. Use different API keys for different environments
3. Always provide fallback values in the configuration
4. Use feature flags to control functionality across environments
5. Test configuration changes in development before deploying to production
