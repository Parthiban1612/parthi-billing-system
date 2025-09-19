import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { CountdownTimer, PrimaryHeader } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../../../redux/authSlice';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { trackFirebaseEvent } from '../../../lib/analyics';

// OtpVerification screen 
export default function OtpVerification({ route }) {

  const navigation = useNavigation();

  // const [otp, setOtp] = useState('');

  const [isVerifying, setIsVerifying] = useState(false);

  const email = route?.params?.email;

  const { loading } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const handleVerify = async (text) => {

    trackFirebaseEvent('otp_verification_started', {
      email,
    });

    if (isVerifying || !email) {
      trackFirebaseEvent('otp_verification_failed', {
        email,
        error: 'Email is required',
      });
      return; // Prevent multiple calls
    }

    if (text.length !== 6) {
      trackFirebaseEvent('otp_verification_failed', {
        email,
        error: 'OTP length is not 6',
        otp: text,
      });
      return;
    }

    setIsVerifying(true);

    try {

      const result = await dispatch(verifyOtp({ email, otp: text })).unwrap();

      if (result.status === true) {

        trackFirebaseEvent('otp_verification_success', {
          email,
          otp: text,
        });

        navigation.navigate('AuthSuccess');

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: result.message || 'OTP has been verified',
          position: 'top',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: result.message || 'Failed to verify OTP. Please try again.',
          position: 'top',
          visibilityTime: 4000,
        });
      }

    } catch (error) {
      console.log('OTP verification error:', error);
      trackFirebaseEvent('otp_verification_failed', {
        email,
        error: error.message,
      });
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to verify OTP. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      return;
    }

    try {
      const result = await dispatch(sendOtp(email)).unwrap();

      trackFirebaseEvent('otp_verification_resend', {
        email,
      });

      if (result.status === true) {
        trackFirebaseEvent('otp_verification_resend_success', {
          email,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: result.message || 'OTP has been resent to your email',
          position: 'top',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'Failed to resend OTP. Please try again.',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to resend OTP. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#7F4DFF" translucent barStyle="light-content" />
        <PrimaryHeader isFullHeight={true} title="Code Verification" text1={`Please enter the code you received here`} >
          <View style={{
            marginBottom: 16,
          }}>
            <OtpInput
              numberOfDigits={6}
              focusColor="#7E5BEF"
              autoFocus={false}
              hideStick={true}
              blurOnFilled={false}
              type="numeric"
              // onTextChange={(text) => {
              //   setOtp(text);
              // }}
              theme={{
                containerStyle: styles.container,
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                placeholderTextStyle: styles.placeholderText,
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              }}
              onFilled={(text) => {
                if (!isVerifying) {
                  handleVerify(text);
                } else {
                  console.log('Verification already in progress, ignoring onFilled call');
                }
              }}
            />
          </View>
          <View style={{
            marginBottom: 16,
          }}>
            <CountdownTimer
              onResend={handleResendOtp}
              canResend={!loading}
            />
            {loading && (
              <ActivityIndicator size="large" style={{
                transform: [{ scaleX: 1 }, { scaleY: 1 }],
              }} color="#9D80FF" />
            )}
          </View>
        </PrimaryHeader>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeContainer: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    marginHorizontal: 6,
    backgroundColor: '#FBF9FF',
  },
  activePinCodeContainer: {
    borderColor: '#7E5BEF',
    borderWidth: 2,
    backgroundColor: '#F3E8FF',
  },
  pinCodeText: {
    fontSize: 20,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
    fontWeight: '700',
  },
  placeholderText: {
    color: '#ccc',
  },
  filledPinCodeContainer: {
    backgroundColor: '#FBF9FF',
    borderColor: '#DEDAE7',
  },
  focusStick: {
    height: 2,
    width: '60%',
    backgroundColor: '#7E5BEF',
    marginTop: 4,
  },
});
