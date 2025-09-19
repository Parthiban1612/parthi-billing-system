import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCountries } from '../redux/countrySlice';
import CountryModal from './CountryModal';
import GenderModal from './GenderModal';
import Button from './Button';
import { TouchableRipple } from 'react-native-paper';

// Validation schema
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  phoneNumber: Yup.string()
    .matches(/^\+[0-9]+\s[0-9\-\s()]+$/, 'Phone number must start with country code (e.g., +1 123 456 7890)')
    .min(12, 'Phone number must be at least 12 characters including country code')
    .max(20, 'Phone number must be less than 20 characters')
    .required('Phone number is required'),
  gender: Yup.string()
    .required('Please select your gender'),
  country: Yup.string()
    .required('Please select your country'),
});

const ProfileForm = ({
  initialValues = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    country: '',
    phoneCode: '',
    countryId: '',
    email: '', // Add email to initialValues
  },
  onSubmit,
  submitButtonText = "Save Profile",
  submitButtonLoading = false,
  submitButtonDisabled = false,
  showSubmitButton = true,
  onFieldChange,
  mode = 'create', // 'create' or 'update'
}) => {
  const dispatch = useDispatch();
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { countries, loading: countriesLoading, error: countriesError } = useSelector((state) => state.country);

  // Fetch countries on component mount
  useEffect(() => {
    if (token) {
      dispatch(fetchCountries(token));
    }
  }, [dispatch, token]);

  const genderOptions = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 },
    { label: 'Other', value: 3 },
  ];

  // Transform API countries data to dropdown format - memoized for performance
  const countryOptions = React.useMemo(() => {
    return countries?.map((country) => ({
      value: country.phone_code,
      label: country.name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      image: {
        uri: country.flag || 'https://www.vigcenter.com/public/all/images/default-image.jpg',
      },
      id: country.id, // Add country ID
    })) || [];
  }, [countries]);

  const handleFormSubmit = async (values) => {

    if (onSubmit) {
      await onSubmit(values);
    }
  };

  const handleFieldChange = (fieldName, value, setFieldValue) => {
    setFieldValue(fieldName, value);
    if (onFieldChange) {
      onFieldChange(fieldName, value);
    }
  };

  return (
    <View style={styles.formRoot}>
      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize={mode === 'update'}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isValid, dirty }) => (
          <View>
            {/* Show email field only in update mode */}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name
                <Text style={styles.requiredText}>
                  *
                </Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.firstName && errors.firstName && styles.inputError
                ]}
                placeholder="Enter your first name"
                value={values.firstName}
                onChangeText={(text) => handleFieldChange('firstName', text, setFieldValue)}
                onBlur={handleBlur('firstName')}
                placeholderTextColor="#999"
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name
                <Text style={styles.requiredText}>
                  *
                </Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.lastName && errors.lastName && styles.inputError
                ]}
                placeholder="Enter your last name"
                value={values.lastName}
                onChangeText={(text) => handleFieldChange('lastName', text, setFieldValue)}
                onBlur={handleBlur('lastName')}
                placeholderTextColor="#999"
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>

            {mode === 'update' && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={values.email}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Email"
                  placeholderTextColor="#999"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country
                <Text style={styles.requiredText}>
                  *
                </Text>
              </Text>
              <TouchableRipple
                style={[
                  styles.countryButton,
                  touched.country && errors.country && styles.countryButtonError,
                  (countriesLoading || !token) && styles.countryButtonDisabled
                ]}
                onPress={() => {
                  setShowCountryModal(true);
                }}
                disabled={countriesLoading || !token}
                rippleColor={`rgba(60,60,60,0.12)`}
                borderless
              >
                <>
                  {values.country ? (
                    <View style={styles.selectedCountryContainer}>
                      {countryOptions.find(c => c.value === values.country)?.image && (
                        <Image
                          source={countryOptions.find(c => c.value === values.country).image}
                          style={styles.countryImageStyle}
                        />
                      )}
                      <Text style={styles.selectedCountryText}>
                        {countryOptions.find(c => c.value === values.country)?.label || 'Selected Country'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.countryButtonPlaceholder}>
                      {!token ? "Authentication required" : countriesLoading ? "Loading countries..." : "Select Country"}
                    </Text>
                  )}
                  <AntDesign name="down" size={16} color="#666" />
                </>
              </TouchableRipple>
              {touched.country && errors.country && (
                <Text style={styles.errorText}>{errors.country}</Text>
              )}
              {!token && (
                <Text style={styles.errorText}>Authentication required to load countries</Text>
              )}
              {countriesError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{countriesError}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number
                <Text style={styles.requiredText}>
                  *
                </Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.phoneNumber && errors.phoneNumber && styles.inputError
                ]}
                placeholder="Phone number"
                value={values.phoneNumber}
                onChangeText={(text) => handleFieldChange('phoneNumber', text, setFieldValue)}
                onBlur={handleBlur('phoneNumber')}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender
                <Text style={styles.requiredText}>
                  *
                </Text>
              </Text>
              <TouchableRipple
                style={[
                  styles.genderButton,
                  touched.gender && errors.gender && styles.genderButtonError
                ]}
                onPress={() => setShowGenderModal(true)}
                rippleColor={`rgba(60,60,60,0.12)`}
                borderless
              >
                <>
                  {values.gender ? (
                    <Text style={styles.selectedGenderText}>
                      {genderOptions.find(g => g.value === values.gender)?.label || 'Selected Gender'}
                    </Text>
                  ) : (
                    <Text style={styles.genderButtonPlaceholder}>
                      Select Gender
                    </Text>
                  )}
                  <AntDesign name="down" size={16} color="#666" />
                </>
              </TouchableRipple>
              {touched.gender && errors.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}
            </View>

            {showSubmitButton && (
              <Button
                theme="dark"
                onPress={handleSubmit}
                loading={submitButtonLoading}
                label={submitButtonLoading ? 'Saving...' : submitButtonText}
              >
                <Text style={[
                  styles.submitButtonText,
                  (!isValid || !dirty || submitButtonDisabled) && styles.submitButtonTextDisabled
                ]}>
                  {submitButtonLoading ? 'Saving...' : submitButtonText}
                </Text>
              </Button>
            )}

            {/* Country Selection Modal */}
            <CountryModal
              visible={showCountryModal}
              onClose={() => setShowCountryModal(false)}
              countries={countryOptions}
              onSelectCountry={(country) => {
                handleFieldChange('country', country.value, setFieldValue);
                handleFieldChange('countryId', country.id, setFieldValue);

                // Auto-prepend phone code to phone number if it doesn't already start with it
                const currentPhoneNumber = values.phoneNumber;
                const phoneCode = `+${country.value}`;

                if (!currentPhoneNumber.startsWith(phoneCode)) {
                  // If phone number is empty or doesn't start with the selected country's code
                  if (!currentPhoneNumber || currentPhoneNumber.trim() === '') {
                    handleFieldChange('phoneNumber', phoneCode + ' ', setFieldValue);
                  } else {
                    // If there's already a phone number, replace any existing country code
                    const phoneWithoutCode = currentPhoneNumber.replace(/^\+\d+\s*/, '');
                    handleFieldChange('phoneNumber', phoneCode + ' ' + phoneWithoutCode, setFieldValue);
                  }
                }

                setShowCountryModal(false);
              }}
              selectedCountry={countryOptions.find(c => c.value === values.country)}
              loading={countriesLoading}
            />

            {/* Gender Selection Modal */}
            <GenderModal
              visible={showGenderModal}
              onClose={() => setShowGenderModal(false)}
              onSelectGender={(gender) => {
                handleFieldChange('gender', gender.value, setFieldValue);
                setShowGenderModal(false);
              }}
              selectedGender={values.gender}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  formRoot: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    lineHeight: 12,
    fontFamily: 'instrument-sans-500',
    color: '#111013',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: 'instrument-sans-400',
    marginTop: 4,
    marginLeft: 4,
  },
  requiredText: {
    color: '#545257',
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'instrument-sans-400',
    marginLeft: 4,
  },
  errorContainer: {
    marginTop: 4,
  },
  countryImageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  countryButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  countryButtonError: {
    borderColor: '#FF6B6B',
  },
  countryButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  selectedCountryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCountryText: {
    fontSize: 15,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
    marginLeft: 10,
  },
  countryButtonPlaceholder: {
    fontSize: 15,
    fontFamily: 'instrument-sans-400',
    color: '#999',
    flex: 1,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  genderButtonError: {
    borderColor: '#FF6B6B',
  },
  selectedGenderText: {
    fontSize: 15,
    fontFamily: 'instrument-sans-400',
    color: '#111013',
    flex: 1,
  },
  genderButtonPlaceholder: {
    fontSize: 15,
    fontFamily: 'instrument-sans-400',
    color: '#999',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'instrument-sans-600',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
});

export default ProfileForm; 