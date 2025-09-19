// Base API configuration
export const API_BASE_URL = 'https://mapi.trundle.me';

export const RZP_TEST_KEY = 'rzp_test_rwwI0xDFigS3Fz';

// Common axios configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'S0HU1TJi.YN1ikR4PcO9bLM5BcaZh8qRuhHTXBZZc',
  },
};

export const FIREBASE_CONFIG = {
  PROJECT_ID: 'trundle-59e63',
  STORAGE_BUCKET: 'trundle-59e63.firebasestorage.app',
  API_KEY: 'AIzaSyBPQEOBhHDBUSYQvP9-igj0NzXh9ln8feM',
  APP_ID: '1:625287918130:android:9c9953e166bd4186d6022b',
};

// API endpoints with full URLs
export const ENDPOINTS = {
  SEND_OTP: `${API_BASE_URL}/accounts/send-code`,
  VERIFY_OTP: `${API_BASE_URL}/accounts/verify-otp`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  FORGOT_PASSWORD: `${API_BASE_URL}/account/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/account/reset-password`,
  COUNTRIES: `${API_BASE_URL}/accounts/all-countries`,
  TRAVEL_COUNTRIES: `${API_BASE_URL}/itinerary/Itinerary-trip-countries`,
  CREATE_PROFILE: `${API_BASE_URL}/accounts/update-profile`,
  GET_USER_PROFILE: `${API_BASE_URL}/accounts/user-details`,
  SUBMIT_USER_COUNTRY: `${API_BASE_URL}/itinerary/submit-user-country`,
  GET_ALL_ITINERARIES: `${API_BASE_URL}/itinerary/get-all-itineraries`,
  GET_CATEGORIES: `${API_BASE_URL}/itinerary/get-categories`,
  GET_SUB_CATEGORIES: `${API_BASE_URL}/itinerary/get-sub-categories`,
  ADD_FAVOURITE: `${API_BASE_URL}/itinerary/add-trip`,
  REMOVE_FAVOURITE: `${API_BASE_URL}/itinerary/delete-trip`,
  GET_FAVOURITES: `${API_BASE_URL}/itinerary/get-trips`,
  GET_FAVOURITE: `${API_BASE_URL}/itinerary/get-single-itinerary`,
  GET_UPDATES: `${API_BASE_URL}/notification/get-updates`,
  GET_TIPS: `${API_BASE_URL}/notification/get-tips`,
  GET_QUESTIONS: `${API_BASE_URL}/recommendation/questions`,
  SUBMIT_USER_PREFERENCE: `${API_BASE_URL}/recommendation/submit-answer`,
  UPDATE_READED: `${API_BASE_URL}/notification/read-notification`,
  GET_USER_SELECTED_COUNTRY: `${API_BASE_URL}/itinerary/get-submitted-country`,
  UPDATE_USER_PROFILE: `${API_BASE_URL}/accounts/upload-profile-image`,
  INITIATE_PAYMENT: `${API_BASE_URL}/payment/initiate`,
  CONFIRM_PAYMENT: `${API_BASE_URL}/payment/confirm`,

  // RZP
  RZP_INITIATE_PAYMENT: `${API_BASE_URL}/payment/initiate`,
  RZP_CONFIRM_PAYMENT: `${API_BASE_URL}/payment/confirmation`,
  RZP_VERIFY_PAYMENT: `${API_BASE_URL}/payment/verify`,

  GET_PLANS: `${API_BASE_URL}/payment/plans`,

  PRIVACY_POLICY: `${API_BASE_URL}/cms/large-contents/privacy-policy`,
  TERMS_OF_SERVICE: `${API_BASE_URL}/cms/large-contents/terms-of-service`,
  TERMS_AND_CONDITIONS: `${API_BASE_URL}/cms/large-contents/terms-and-conditions`,
  REFUND_AND_CANCELLATION: `${API_BASE_URL}/cms/large-contents/refund-and-cancellation`,

  GOOGLE_SIGN_IN: `${API_BASE_URL}/accounts/google-sign-in`,

  GET_ACTIVITIES: `${API_BASE_URL}/itinerary/activities`,

  COMPLETED_TRIPS: `${API_BASE_URL}/payment/completed-trips`,

  GET_PAYMENT_HISTORY: `${API_BASE_URL}/payment/payment-history`,

  DOWNLOAD_INVOICE: `${API_BASE_URL}/payment/invoice-download`,

  ZOHO_SALES_APP_KEY: `ocrGIIxqgug8FF0dQm7f2f%2FusB50z0o%2BWxgZVVM343lA8Y2Lq4ARzJwRFZvKZPXB_in`,
  ZOHO_SALES_IQ_ACCESS_KEY: `kZb1TZ%2BPa80lPz7je7NdJsjhwzzB5R5PM2V4l7R4sB1J39m2ToTfN1NVTeiJTOo8Pp7GHlCcuyzfjLoygJeY3FtJsYqGJHLrXc6eqNkUY6RctNbvSOUicc32muET%2BMtd`,
}; 