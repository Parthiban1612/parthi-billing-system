import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAvoidingWrapper, ProfileForm, PrimaryLayout, TestSheet } from '../../../components';
import { useSelector, useDispatch } from 'react-redux';
import { Surface } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from '../../../utils/platformUtils';
import { updateProfile, getUserProfile } from '../../../redux/authSlice';
import { trackFirebaseEvent } from '../../../lib/analyics';
import AnimatedHeaderPage from '../../../components/AnimatedHeaderPage';

export default function UpdateProfile({ navigation }) {

  const dispatch = useDispatch();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const { token, user } = useSelector((state) => state.auth);

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

  const handleUpdateProfile = async (values) => {
    setIsUpdatingProfile(true);

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

      const response = await dispatch(updateProfile({ formData, token }));

      if (response?.payload?.status === true) {

        await dispatch(getUserProfile(token));

        trackFirebaseEvent('update_profile_success', {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
        });

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response?.payload?.message || 'Profile has been updated',
          position: 'top',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.payload?.message || 'Failed to update profile',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    console.log(`Field ${fieldName} changed to:`, value);
  };

  return (
    <AnimatedHeaderPage title={"Update Profile"}>
      <Surface
        style={{ width: '92%', margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 16 }}
      >
        <ProfileForm
          mode="update"
          initialValues={getInitialValues()}
          onSubmit={handleUpdateProfile}
          onFieldChange={handleFieldChange}
          submitButtonText="Update Profile"
          submitButtonLoading={isUpdatingProfile}
          submitButtonDisabled={isUpdatingProfile}
        />
      </Surface>
      <TestSheet />
    </AnimatedHeaderPage>
  );
}