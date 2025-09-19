import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

import { Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { Button, PrimaryHeader, AlertBanner, KeyboardAvoidingWrapper } from '../../../components';

import { sendOtp } from '../../../redux/authSlice';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector(state => state.auth);

  const handleSignIn = async (values) => {
    try {
      const result = await dispatch(sendOtp(values.email)).unwrap();

      if (result.status) {
        navigation.navigate('OtpVerification', { email: values.email });
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <StatusBar backgroundColor="#7F4DFF" translucent barStyle="light-content" />
      <PrimaryHeader isFullHeight={true} title="Sign In" text1="Please enter your email address to proceed" >
        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSignIn}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
              <View style={styles.inputContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Email </Text>
                  <Text style={styles.asterisk}>*</Text>
                </View>
                <TextInput
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#757087"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={[
                    styles.input
                  ]}
                  outlineStyle={[styles.outlineStyle, touched.email && errors.email && styles.inputError]}
                  mode="outlined"
                  textColor="#333"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View>
                <AlertBanner
                  message={`We'll send you a one-time code to verify your email address`}
                  description="Please enter your email address"
                />
                <Button
                  theme="dark"
                  onPress={handleSubmit}
                  text="Send code"
                  loading={loading}
                  disabled={loading}
                />
              </View>
            </View>
          )}
        </Formik>
      </PrimaryHeader>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontFamily: 'instrument-sans-500',
    color: '#333',
  },
  asterisk: {
    fontSize: 12,
    fontFamily: 'instrument-sans-700',
    color: '#545257',
    opacity: .6,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 15,
    borderWidth: 0,
    fontFamily: 'instrument-sans-700',
  },
  outlineStyle: {
    borderRadius: 12,
    borderColor: '#8B5CF6',
    borderWidth: 1,
  },
  inputError: {
    borderRadius: 12,
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    fontFamily: 'instrument-sans-500',
    marginTop: 4,
    marginBottom: 8,
  },
});

export default SignInScreen; 