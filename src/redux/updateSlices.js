import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';

// Fetch updates from API based on category ID
export const getUpdates = createAsyncThunk(
  'updates/getUpdates',
  async (_, { rejectWithValue, getState }) => {

    const { token } = getState().auth;

    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${ENDPOINTS.GET_UPDATES}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch updates'
      );
    }
  }
);

export const updateReaded = createAsyncThunk(
  'updates/updateReaded',
  async (formData, { rejectWithValue, getState }) => {

    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.post(`${ENDPOINTS.UPDATE_READED}`, formData, { ...config });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update readed'
      );
    }
  }
);


export const getTips = createAsyncThunk(
  'tips/getTips',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${ENDPOINTS.GET_TIPS}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tips'
      );
    }
  }
);

export const submitUserPreference = createAsyncThunk(
  'userPreference/submitUserPreference',
  async (data, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${ENDPOINTS.SUBMIT_USER_PREFERENCE}`, data, { ...config });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit user preference'
      );
    }
  }
);

export const fetchUserPreference = createAsyncThunk(
  'userPreference/fetchUserPreference',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${ENDPOINTS.SUBMIT_USER_PREFERENCE}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user preference'
      );
    }
  }
);

export const updateUserPreference = createAsyncThunk(
  'userPreference/updateUserPreference',
  async (data, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${ENDPOINTS.SUBMIT_USER_PREFERENCE}`, data, { ...config });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user preference'
      );
    }
  }
);

// Fetch updates from API based on category ID
export const resetUpdates = createAsyncThunk(
  'updates/reset-updates',
  async (_, { rejectWithValue, getState }) => {

    const { token } = getState().auth;

    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${ENDPOINTS.GET_UPDATES}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch updates'
      );
    }
  }
);

const updatesSlice = createSlice({
  name: 'updates',
  initialState: {
    updates: [],
    updatesLoading: false,
    error: null,
    tips: [],
    tipsLoading: false,
    userPreference: null,
    userPreferenceLoading: false,
    userPreferenceError: null,
    updateUserPreferenceLoading: false,
    updateUserPreferenceError: null,
    updateUserPreference: null,
    resetUpdatesLoading: false,
    resetUpdatesError: null,
  },
  reducers: {
    updatePreference: (state, action) => {
      state.userPreference = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Favourite
      .addCase(getUpdates.pending, (state) => {
        state.updatesLoading = true;
        state.error = null;
      })
      .addCase(getUpdates.fulfilled, (state, action) => {
        state.updatesLoading = false;
        state.updates = action.payload;
      })
      .addCase(getUpdates.rejected, (state, action) => {
        state.updatesLoading = false;
        state.error = action.payload;
      })
      .addCase(getTips.pending, (state) => {
        state.tipsLoading = true;
        state.error = null;
      })
      .addCase(getTips.fulfilled, (state, action) => {
        state.tipsLoading = false;
        state.tips = action.payload;
      })
      .addCase(getTips.rejected, (state, action) => {
        state.tipsLoading = false;
        state.error = action.payload;
      })
      .addCase(submitUserPreference.pending, (state) => {
        state.userPreferenceLoading = true;
        state.userPreferenceError = null;
      })
      .addCase(submitUserPreference.fulfilled, (state, action) => {
        state.userPreferenceLoading = false;
        state.userPreference = action.payload;
      })
      .addCase(fetchUserPreference.pending, (state) => {
        state.userPreferenceLoading = true;
        state.userPreferenceError = null;
      })
      .addCase(fetchUserPreference.fulfilled, (state, action) => {
        state.userPreferenceLoading = false;
        state.userPreference = action.payload;
      })
      .addCase(fetchUserPreference.rejected, (state, action) => {
        state.userPreferenceLoading = false;
        state.userPreferenceError = action.payload;
      })
      .addCase(updateUserPreference.pending, (state) => {
        state.updateUserPreferenceLoading = true;
        state.updateUserPreferenceError = null;
      })
      .addCase(updateUserPreference.fulfilled, (state, action) => {
        state.updateUserPreferenceLoading = false;
        state.updateUserPreference = action.payload;
      })
      .addCase(updateUserPreference.rejected, (state, action) => {
        state.updateUserPreferenceLoading = false;
        state.updateUserPreferenceError = action.payload;
      })
      .addCase(resetUpdates.pending, (state) => {
        state.resetUpdatesLoading = true;
        state.resetUpdatesError = null;
      })
      .addCase(resetUpdates.fulfilled, (state, action) => {
        state.resetUpdatesLoading = false;
        state.updates = action.payload;
      })
      .addCase(resetUpdates.rejected, (state, action) => {
        state.resetUpdatesLoading = false;
        state.resetUpdatesError = action.payload;
      })
  },
});

export const { updatePreference } = updatesSlice.actions;

export default updatesSlice.reducer;


