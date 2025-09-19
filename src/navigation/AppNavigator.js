import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import { BuySheetProvider } from '../context/BuySheetContext';
import {
  AuthSuccess,
  PaymentSuccess,
  IntroCarousel,
  SignUpType,
  SignIn,
  OtpVerification,
  CreateProfile,
  Account,
  PrivacyPolicy,
  TermsAndConditions,
  TermsOfServices,
  RefundAndCancellation,
  SelectCountryForTrip,
  UpdateProfile,
  PersonalisedSettings,
  LocationDetails,
  BottomTabNavigator,
  PaymentHistory,
  CompletedTrips,
} from '../screens';
import { initializeApp, getApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '../redux/endpoints';

const Stack = createStackNavigator();

const firebaseConfig = {
  projectId: FIREBASE_CONFIG.PROJECT_ID,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  apiKey: FIREBASE_CONFIG.API_KEY,
  appId: FIREBASE_CONFIG.APP_ID,
};

initializeApp(firebaseConfig);
getApp();

const AppNavigator = () => {
  // Use AuthContext instead of Redux selectors

  // Keep travelCountries from Redux as it's not part of auth
  // const { submittedCountry } = useSelector((state) => state.travelCountries);

  const navigationRef = useRef();

  const { isAuthenticated, introSeen } = useSelector((state) => state.auth);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={async (state) => {
        const currentRouteName = state.routes[state.index].name;
        await analytics().logScreenView({
          screen_name: currentRouteName,
        });
      }}
    >
      <BuySheetProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'default',
          }}
        // initialRouteName="PaymentSuccess"
        >

          {!introSeen && (
            <Stack.Screen name="IntroCarousel" component={IntroCarousel} />
          )}

          {isAuthenticated && (
            <>
              <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
              <Stack.Screen name="Account" component={Account} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
              <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
              <Stack.Screen name="TermsOfServices" component={TermsOfServices} />
              <Stack.Screen name="RefundAndCancellation" component={RefundAndCancellation} />
              <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
              <Stack.Screen name="PersonalisedSettings" component={PersonalisedSettings} />
              <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
              <Stack.Screen name="LocationDetails" component={LocationDetails} />
              <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
              <Stack.Screen name="CompletedTrips" component={CompletedTrips} />
            </>
          )}

          {!isAuthenticated && (
            <>
              <Stack.Screen name="SignUpType" component={SignUpType} />
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="OtpVerification" component={OtpVerification} />
              <Stack.Screen name="CreateProfile" component={CreateProfile} />
              <Stack.Screen name="SelectCountryForTrip" component={SelectCountryForTrip} />
              <Stack.Screen name="AuthSuccess" component={AuthSuccess} />
            </>
          )}

        </Stack.Navigator>
      </BuySheetProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
