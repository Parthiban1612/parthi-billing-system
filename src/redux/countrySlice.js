import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';

// Fetch countries from API
export const fetchCountries = createAsyncThunk(
  'country/fetchCountries',
  async (token, { rejectWithValue }) => {
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(ENDPOINTS.COUNTRIES, config);
      return response.data;
    } catch (error) {
      console.log('error', JSON.stringify(error?.response, null, 2));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch countries'
      );
    }
  }
);

const countrySlice = createSlice({
  name: 'country',
  initialState: {
    countries: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCountryError: (state) => {
      state.error = null;
    },
    clearCountries: (state) => {
      state.countries = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload.data || action.payload || [];
        state.error = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch countries';
      });
  },
});

export const { clearCountryError, clearCountries } = countrySlice.actions;
export default countrySlice.reducer; 