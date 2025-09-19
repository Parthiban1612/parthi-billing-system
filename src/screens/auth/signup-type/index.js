import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';

import NextButton from '../../../components/Button';
import PrimaryHeader from '../../../components/PrimaryHeader';
import { Divider } from 'react-native-paper';

import { MailIcon, GoogleIcon } from '../../../../assets';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { googleSignIn } from '../../../redux/authSlice';
import { useDispatch } from 'react-redux';

import Toast from 'react-native-toast-message';
import { trackFirebaseEvent } from '../../../lib/analyics';

export default function SignUpTypeScreen({ navigation }) {

  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '625287918130-n3c1pr21r8ql88i1jo0o95iltvp5ks64.apps.googleusercontent.com',
    });
  }, [])

  const handleEmailSignUp = () => {
    trackFirebaseEvent('signup_type_email_button_clicked', {
      method: 'email',
    });
    navigation.navigate('SignIn');
  };

  const [loading, setLoading] = useState(false);

  const onGoogleButtonPress = async () => {
    trackFirebaseEvent('signup_type_google_button_clicked', {
      method: 'google',
    });
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.idToken || signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('Could not get ID token from Google');
      }

      await dispatch(googleSignIn(idToken));

      navigation.navigate('AuthSuccess');

    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to sign in with Google',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StatusBar backgroundColor="#7F4DFF" translucent barStyle="light-content" />
      <PrimaryHeader title="Welcome to Trundle" text1="Sign in quickly with your email or Gmail">
        <View style={{ gap: 12, width: "100%" }}>
          <NextButton
            theme="dark"
            onPress={handleEmailSignUp}
            icon={() => <MailIcon height={16} width={16} />}
            text="Sign up with Email"
          />
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 24, marginHorizontal: 40 }}>
            <Divider
              style={{
                flex: 1,
                height: 1,
                backgroundColor: '#DAD8DF',
              }}
              theme={{ colors: { primary: '#DAD8DF' } }} />
            <Text>
              Or
            </Text>
            <Divider
              style={{
                flex: 1,
                height: 1,
                backgroundColor: '#DAD8DF',
              }}
              theme={{ colors: { primary: '#DAD8DF' } }} />
          </View>
          <NextButton
            loading={loading}
            theme="light"
            onPress={onGoogleButtonPress}
            icon={() => <GoogleIcon height={16} width={16} color={"white"} name='mail-outline' />}
            text="Sign up with Google"
          />
        </View>
      </PrimaryHeader>
    </>
  )
}