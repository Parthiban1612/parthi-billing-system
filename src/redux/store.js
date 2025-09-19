

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

// Import your slices
import authReducer from './authSlice';
import countryReducer from './countrySlice';
import travelCountriesReducer from './travelCountriesSlice';
import categoriesReducer from './categoriesSlice';
import subCategoriesReducer from './subCategoriesSlice';
import favouriteReducer from './favouriteSlice';
import carouselReducer from './carouselSlice';
import updatesReducer from './updateSlices';
import paymentReducer from './paymentSlice';
import cmsReducer from './cmsSlice';

// Create persist config for travelCountries slice
const travelCountriesPersistConfig = {
  key: 'travelCountries',
  storage: AsyncStorage,
  whitelist: ['selectedCountry', 'selectedCity', 'travelCountries', 'submittedCountry'], // Only persist selectedCountry, selectedCity and travelCountries data
};

const rootReducer = combineReducers({
  auth: authReducer,
  country: countryReducer,
  travelCountries: persistReducer(travelCountriesPersistConfig, travelCountriesReducer),
  categories: categoriesReducer,
  subCategories: subCategoriesReducer,
  favourite: favouriteReducer,
  carousel: carouselReducer,
  updates: updatesReducer,
  payment: paymentReducer,
  cms: cmsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);