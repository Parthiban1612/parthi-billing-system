// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';

// Send OTP
export const sendOtp = createAsyncThunk('auth/sendOtp', async (email) => {
  try {
    const response = await axios.post(ENDPOINTS.SEND_OTP, { email }, axiosConfig);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
});

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }) => {
    try {
      const response = await axios.post(ENDPOINTS.VERIFY_OTP, { email, otp }, axiosConfig);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const createProfile = createAsyncThunk('auth/createProfile', async ({ formData, token }, { rejectWithValue }) => {
  try {
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.post(ENDPOINTS.CREATE_PROFILE, formData, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create profile'
    );
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ formData, token }, { rejectWithValue }) => {
  try {
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.post(ENDPOINTS.CREATE_PROFILE, formData, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update profile'
    );
  }
});

export const updateUserProfileImage = createAsyncThunk('auth/updateUserProfileImage', async (formData, { rejectWithValue, getState }) => {

  const { auth } = getState();

  const token = auth.token;

  try {
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.post(ENDPOINTS.UPDATE_USER_PROFILE, formData, config);
    return response.data;
  } catch (error) {

    return rejectWithValue(
      error.response?.data?.message || 'Failed to update user profile image'
    );
  }
});

export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (idToken, { rejectWithValue }) => {
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
        },
      };

      const response = await axios.post(ENDPOINTS.GOOGLE_SIGN_IN, { token: idToken }, config);

      const data = response.data;
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.Message || 'Google Sign-in failed on server.');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sign in with Google');
    }
  }
);

export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (_, { rejectWithValue, getState }) => {
  const { auth } = getState();
  const token = auth.token;
  try {
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(ENDPOINTS.GET_USER_PROFILE, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to get user profile'
    );
  }
});

// Set isViewSuccessScreen
export const setIsViewSuccessScreen = createAsyncThunk(
  'auth/setIsViewSuccessScreen',
  async (isViewSuccessScreen) => {
    return isViewSuccessScreen;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    introSeen: false,
    isViewSuccessScreen: false,
    isProfileCompleted: false,
    profileImage: null,
    isPaidUser: false,
    currentRouteName: "HomeTab",
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isViewSuccessScreen = false;
      state.isProfileCompleted = false;
    },
    clearProfileImage(state) {
      if (state.user && state.user.data) {
        state.user.data.photo = null;
      }
    },
    updateUserPhoto(state, action) {
      state.profileImage = action.payload;
    },
    setIntroSeen(state, action) {
      state.introSeen = action.payload !== undefined ? action.payload : true;
    },
    resetIntroSeen(state) {
      state.introSeen = false;
    },
    updateIsPaidUser(state, action) {
      state.isPaidUser = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    clearAuthState(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.isViewSuccessScreen = false;
      state.isPaidUser = false;
    },
    clearError(state) {
      state.error = null;
    },
    setCurrentRouteName(state, action) {
      state.currentRouteName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === true) {
          state.token = action.payload.access;
          // state.isAuthenticated = true;
          state.isProfileCompleted = action.payload.profile_completed;
          state.isPaidUser = action.payload.is_purchase;
        }
        state.error = null;
      })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(setIsViewSuccessScreen.fulfilled, (state, action) => {
        state.isViewSuccessScreen = action.payload;
      })
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Handle successful profile creation
        if (action.payload.status === true) {
          state.isProfileCompleted = true;
        }
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Handle successful profile update
        if (action.payload.status === true) {
          // Update the user state with new profile data
          if (state.user && action.payload.data) {
            state.user = {
              ...state.user,
              data: {
                ...state.user.data,
                ...action.payload.data
              }
            };
          }
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
        state.profileImage = action.payload.data.photo;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUserProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the user's photo in the state when profile image is successfully updated
        if (action.payload?.status === true && action.payload?.data?.photo && state.user) {
          state.user = {
            ...state.user,
            data: {
              ...state.user.data,
              photo: action.payload.data.photo
            }
          };
        }
      })
      .addCase(updateUserProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === true) {
          state.token = action.payload.access;
          // state.isAuthenticated = true;
          // state.isProfileCompleted = true;
          state.isPaidUser = action.payload.is_purchase;
        }
        state.error = null;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.isAuthenticated = false;
      })

  },
});

export const { logout, setIntroSeen, resetIntroSeen, clearAuthState, clearError, clearProfileImage, updateUserPhoto, updateIsPaidUser, setIsAuthenticated, setCurrentRouteName } = authSlice.actions;
export default authSlice.reducer;
