import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';

// Fetch sub-categories from API based on category ID
export const fetchSubCategories = createAsyncThunk(
  'subCategories/fetchSubCategories',
  async ({ categoryId, token }, { rejectWithValue }) => {
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${ENDPOINTS.GET_SUB_CATEGORIES}?category_id=${categoryId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch sub-categories'
      );
    }
  }
);

const subCategoriesSlice = createSlice({
  name: 'subCategories',
  initialState: {
    subCategories: [],
    subCategoriesLoading: false, // Renamed from loading to be more specific
    error: null,
    currentCategoryId: null,
  },
  reducers: {
    clearSubCategories: (state) => {
      state.subCategories = [];
      state.subCategoriesLoading = false;
      state.error = null;
      state.currentCategoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.subCategoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.subCategoriesLoading = false;
        state.subCategories = action.payload.data || [];
        state.currentCategoryId = action.meta.arg.categoryId;
        state.error = null;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.subCategoriesLoading = false;
        state.error = action.payload || 'Failed to fetch sub-categories';
      });
  },
});

export const { clearSubCategories } = subCategoriesSlice.actions;
export default subCategoriesSlice.reducer; 