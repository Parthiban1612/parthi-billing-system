import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';
import Toast from 'react-native-toast-message';

// Fetch privacy policy from API
export const fetchPrivacyPolicy = createAsyncThunk(
  'cms/fetchPrivacyPolicy',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      };
      const response = await axios.get(ENDPOINTS.PRIVACY_POLICY, config);
      return response.data;
    } catch (error) {
      console.log('Error fetching privacy policy:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch privacy policy';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch terms of service from API
export const fetchTermsOfService = createAsyncThunk(
  'cms/fetchTermsOfService',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      };
      const response = await axios.get(ENDPOINTS.TERMS_OF_SERVICE, config);
      return response.data;
    } catch (error) {
      console.log('Error fetching terms of service:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch terms of service';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch terms and conditions from API
export const fetchTermsAndConditions = createAsyncThunk(
  'cms/fetchTermsAndConditions',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      };
      const response = await axios.get(ENDPOINTS.TERMS_AND_CONDITIONS, config);
      return response.data;
    } catch (error) {
      console.log('Error fetching terms and conditions:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch terms and conditions';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch refund and cancellation from API
export const fetchRefundAndCancellation = createAsyncThunk(
  'cms/fetchRefundAndCancellation',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      };
      const response = await axios.get(ENDPOINTS.REFUND_AND_CANCELLATION, config);
      return response.data;
    } catch (error) {
      console.log('Error fetching refund and cancellation:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch refund and cancellation';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch activities from API
export const fetchActivities = createAsyncThunk(
  'cms/fetchActivities',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get(ENDPOINTS.GET_ACTIVITIES, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      return response.data;
    } catch (error) {
      console.log('Error fetching activities:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch activities';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  privacyPolicy: null,
  termsOfService: null,
  termsAndConditions: null,
  refundAndCancellation: null,
  activities: null,
  loading: false,
  error: null,
};

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearContent: (state) => {
      state.privacyPolicy = null;
      state.termsOfService = null;
      state.termsAndConditions = null;
      state.refundAndCancellation = null;
      state.activities = null;
    },
  },
  extraReducers: (builder) => {
    // Privacy Policy
    builder
      .addCase(fetchPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacyPolicy = action.payload;
        state.error = null;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Privacy Policy loaded successfully',
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Terms of Service
    builder
      .addCase(fetchTermsOfService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTermsOfService.fulfilled, (state, action) => {
        state.loading = false;
        state.termsOfService = action.payload;
        state.error = null;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Terms of Service loaded successfully',
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .addCase(fetchTermsOfService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Terms and Conditions
    builder
      .addCase(fetchTermsAndConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTermsAndConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.termsAndConditions = action.payload;
        state.error = null;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Terms and Conditions loaded successfully',
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .addCase(fetchTermsAndConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Refund and Cancellation
    builder
      .addCase(fetchRefundAndCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefundAndCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.refundAndCancellation = action.payload;
        state.error = null;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Refund and Cancellation loaded successfully',
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .addCase(fetchRefundAndCancellation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Activities
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
        state.error = null;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearContent } = cmsSlice.actions;
export default cmsSlice.reducer; 