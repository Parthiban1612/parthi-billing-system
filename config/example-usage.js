// Example usage of the configuration system

import AppConfig from './index';
import { 
  getApiUrl, 
  isDebugMode, 
  logConfig, 
  isDevelopment,
  isProduction,
  getZohoSalesAppKey,
  getZohoSalesIqAccessKey,
  getZohoConfig
} from './helpers';

// Example 1: Basic configuration access
console.log('API Base URL:', AppConfig.api.baseUrl);
console.log('App Name:', AppConfig.app.name);
console.log('Environment:', AppConfig.app.environment);

// Example 2: Using helper functions
const apiUrl = getApiUrl();
console.log('API URL from helper:', apiUrl);

// Example 3: Feature flags
if (AppConfig.features.analyticsEnabled) {
  console.log('Analytics is enabled');
}

// Example 4: Environment-specific code
if (isDevelopment()) {
  console.log('Running in development mode');
  // Enable debug logging, use test API keys, etc.
} else if (isProduction()) {
  console.log('Running in production mode');
  // Use production API keys, disable debug features, etc.
}

// Example 5: Debug logging
if (isDebugMode()) {
  logConfig(); // This will log the configuration only in debug mode
}

// Example 6: Using configuration in API calls
const makeApiCall = async () => {
  const response = await fetch(`${getApiUrl()}/some-endpoint`, {
    headers: {
      'x-api-key': AppConfig.api.apiKey,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Example 7: Conditional feature rendering
const renderNewFeature = () => {
  if (AppConfig.features.newFeatureEnabled) {
    return <div>New Feature Component</div>;
  }
  return null;
};

// Example 8: Service configuration
const initializeServices = () => {
  if (AppConfig.services.googleMapsApiKey) {
    // Initialize Google Maps
    console.log('Initializing Google Maps with key:', AppConfig.services.googleMapsApiKey);
  }
  
  if (AppConfig.services.sentryDsn) {
    // Initialize Sentry
    console.log('Initializing Sentry with DSN:', AppConfig.services.sentryDsn);
  }
};

// Example 9: Zoho Sales configuration
const initializeZohoSales = () => {
  const zohoConfig = getZohoConfig();
  if (zohoConfig.salesAppKey && zohoConfig.salesIqAccessKey) {
    console.log('Initializing Zoho Sales with keys:', {
      appKey: zohoConfig.salesAppKey,
      accessKey: zohoConfig.salesIqAccessKey
    });
    
    // Initialize Zoho Sales IQ
    // Example: ZohoSalesIQ.init(zohoConfig.salesAppKey, zohoConfig.salesIqAccessKey);
  }
};

// Example 10: Using Zoho Sales keys directly
const getZohoSalesKeys = () => {
  return {
    appKey: getZohoSalesAppKey(),
    accessKey: getZohoSalesIqAccessKey()
  };
};

export {
  makeApiCall,
  renderNewFeature,
  initializeServices,
  initializeZohoSales,
  getZohoSalesKeys
};
