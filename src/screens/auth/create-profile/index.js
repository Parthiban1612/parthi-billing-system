import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrimaryHeader, KeyboardAvoidingWrapper, ProfileForm } from '../../../components';
import { useSelector, useDispatch } from 'react-redux';
import { createProfile, setIsAuthenticated } from '../../../redux/authSlice';
import Toast from 'react-native-toast-message';
import { trackFirebaseEvent } from '../../../lib/analyics';

export default function CreateProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const { user } = useSelector((state) => state.auth);

  const handleCreateProfile = async (values) => {

    trackFirebaseEvent('create_profile_started', {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
    });
    setIsCreatingProfile(true);

    try {
      // Extract phone number without country code
      const phoneWithoutCode = values.phoneNumber.replace(/^\+\d+\s*/, '');

      const formData = new FormData();
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('mobile_no', phoneWithoutCode);
      formData.append('phone_code', values.country);
      formData.append('gender', values.gender);
      formData.append('country', values.countryId);

      const response = await dispatch(createProfile({ formData, token }));

      if (response?.payload?.status === true) {

        trackFirebaseEvent('create_profile_success', {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
        });

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response?.payload?.message || 'Profile has been created',
          position: 'top',
          visibilityTime: 3000,
        });
        dispatch(setIsAuthenticated(true));
        navigation.navigate('MainTabs');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.payload?.message || 'Failed to create profile',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      trackFirebaseEvent('create_profile_failed', {
        error: error.message,
      });
    } finally {
      setIsCreatingProfile(false);
    }
  };


  // Transform user data to form format
  const getInitialValues = () => {
    if (!user) {
      return {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        country: '',
        phoneCode: '',
        countryId: '',
      };
    }

    // Format phone number with country code
    const phoneNumber = user?.data?.phone_code && user?.data?.mobile_no
      ? `+${user?.data?.phone_code} ${user?.data?.mobile_no}`
      : '';

    return {
      firstName: user?.data?.first_name || '',
      lastName: user?.data?.last_name || '',
      phoneNumber: phoneNumber,
      gender: user?.data?.gender || '',
      country: user?.data?.phone_code || '',
      phoneCode: user?.data?.phone_code || '',
      countryId: user?.data?.country || '',
      email: user?.data?.email,
    };
  };

  return (
    <>
      <StatusBar backgroundColor="#7F4DFF" barStyle="light-content" />
      <KeyboardAvoidingWrapper
        contentContainerStyle={styles.scrollContent}
      >
        <PrimaryHeader
          title="Create Profile"
          text1="Please enter the requested details"
        >
          <ProfileForm
            initialValues={getInitialValues()}
            mode="create"
            onSubmit={handleCreateProfile}
            submitButtonText="Create Profile"
            submitButtonLoading={isCreatingProfile}
            submitButtonDisabled={isCreatingProfile}
          />
        </PrimaryHeader>
      </KeyboardAvoidingWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
});
