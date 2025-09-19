// Silence Firebase modular deprecation warnings
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import * as Font from 'expo-font';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalBottomSheetProvider } from './src/context/GlobalBottomSheetContext';
import { ZohoSalesIQ } from 'react-native-zohosalesiq-mobilisten';
import { ENDPOINTS } from './src/redux/endpoints';

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


  useEffect(() => {
    // Initialize Zoho SalesIQ
    const initializeZohoSalesIQ = async () => {
      try {
        let appKey;
        let accessKey;

        if (Platform.OS === 'ios') {
          // Replace with your actual iOS keys from Zoho SalesIQ console
          appKey = "YOUR_IOS_APP_KEY";
          accessKey = "YOUR_IOS_ACCESS_KEY";
        } else {
          // Your Android keys
          appKey = ENDPOINTS.ZOHO_SALES_APP_KEY;
          accessKey = ENDPOINTS.ZOHO_SALES_IQ_ACCESS_KEY;
        }

        // Initialize Zoho SalesIQ
        ZohoSalesIQ.initWithCallback(appKey, accessKey, (success) => {
          if (success) {
            console.log("Zoho SalesIQ initialized successfully!");

            // Try direct JS theming - simple approach
            setTimeout(() => {
              try {
                // console.log("Attempting to apply Zoho SalesIQ theme...");

                // Try different theming methods
                if (ZohoSalesIQ.Theme && ZohoSalesIQ.Theme.setThemeColor) {
                  ZohoSalesIQ.Theme.setThemeColor("#FF0000");
                  console.log("✅ Theme color set to RED using Theme.setThemeColor");
                } else if (ZohoSalesIQ.setThemeColor) {
                  ZohoSalesIQ.setThemeColor("#FF0000");
                  console.log("✅ Theme color set to RED using setThemeColor");
                } else {
                  console.log("❌ No theme color methods available");
                }

                // Try to hide launcher
                if (ZohoSalesIQ.Launcher && ZohoSalesIQ.Launcher.setVisibility) {
                  ZohoSalesIQ.Launcher.setVisibility(ZohoSalesIQ.Launcher.VisibilityMode.NEVER);
                  console.log("✅ Launcher hidden successfully");
                } else {
                  console.log("❌ Launcher visibility methods not available");
                }

              } catch (error) {
                console.log("❌ Theming error:", error.message);
              }
            }, 2000); // 2 second delay to ensure Zoho is fully initialized

            // setZohoInitialized(true);
          } else {
            console.error("Zoho SalesIQ initialization failed!");
            // setZohoInitialized(true); // Set to true anyway to not block the app
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