// Silence Firebase modular deprecation warnings
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform, Appearance } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import * as Font from 'expo-font';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalBottomSheetProvider } from './src/context/GlobalBottomSheetContext';
import { SIQTheme, ZohoSalesIQ } from 'react-native-zohosalesiq-mobilisten';
import AppConfig from './config';

function AppFlow() {
  return <AppNavigator />;
}

function PersistLoading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7E5BEF" />
      <Text style={styles.loadingText}>Loading app data...</Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [zohoInitialized, setZohoInitialized] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "instrument-sans-400": require("./assets/fonts/InstrumentSans-Regular.ttf"),
          "instrument-sans-500": require("./assets/fonts/InstrumentSans-Medium.ttf"),
          "instrument-sans-600": require("./assets/fonts/InstrumentSans-SemiBold.ttf"),
          "instrument-sans-700": require("./assets/fonts/InstrumentSans-Bold.ttf"),
          "clash-display-600": require("./assets/fonts/ClashDisplay-Semibold.otf"),
          "clash-display-700": require("./assets/fonts/ClashDisplay-Bold.otf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  // Force light mode regardless of system setting
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  // Create a new theme instance using SIQTheme
  const customTheme = new SIQTheme();

  // Customize properties in the customTheme instance as desired
  customTheme.Navigation.backgroundColor = "#7F4DFF"
  customTheme.Navigation.titleColor = "#FFFFFF"
  customTheme.Navigation.tintColor = "#FFFFFF"
  customTheme.themeColor = "#7F4DFF"

  customTheme.Chat.backgroundColor = "#F5F6F9"
  customTheme.Chat.Input.sendIconColor = "#7F4DFF"
  customTheme.Chat.Input.textFieldPlaceholderColor = "#938EA2"
  customTheme.Chat.Input.textFieldTextColor = "#000000"
  customTheme.Chat.Input.textFieldBackgroundColor = "#FFFFFF"
  customTheme.Chat.Input.textFieldBorderColor = "#938EA2"

  useEffect(() => {
    // Initialize Zoho SalesIQ
    const initializeZohoSalesIQ = async () => {
      try {
        let appKey;
        let accessKey;

        if (Platform.OS === 'ios') {
          // Replace with your actual iOS keys from Zoho SalesIQ console
          appKey = AppConfig.services.zoho.salesAppKey;
          accessKey = AppConfig.services.zoho.salesIqAccessKey;
        } else {
          // Your Android keys
          appKey = AppConfig.services.zoho.salesAppKey;
          accessKey = AppConfig.services.zoho.salesIqAccessKey;
        }

        // Initialize Zoho SalesIQ
        ZohoSalesIQ.initWithCallback(appKey, accessKey, (success) => {
          if (success) {
            ZohoSalesIQ.setThemeForiOS(customTheme);
          } else {
            console.error("Zoho SalesIQ initialization failed!");
          }
        });

      } catch (error) {
        console.error('Error initializing Zoho SalesIQ:', error);
        // setZohoInitialized(true); // Set to true anyway to not block the app
      }
    };

    if (fontsLoaded) {
      initializeZohoSalesIQ();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7E5BEF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<PersistLoading />} persistor={persistor}>
          <PaperProvider>
            <GlobalBottomSheetProvider>
              <AppFlow />
              <Toast />
            </GlobalBottomSheetProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'instrument-sans-500',
  },
});