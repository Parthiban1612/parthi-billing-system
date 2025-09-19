import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';

// Fetch categories from API
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (token, { rejectWithValue }) => {
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(ENDPOINTS.GET_CATEGORIES, config);
      return response.data;
    } catch (error) {
      console.log('error', JSON.stringify(error?.response, null, 2));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    categoriesLoading: false, // Renamed from loading to be more specific
    error: null,
    selectedCategoryId: null,
    selectedSubcategoryId: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.categories = [];
      state.categoriesLoading = false;
      state.error = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
    setSelectedSubcategory: (state, action) => {
      state.selectedSubcategoryId = action.payload;
    },
    clearSelectedFilters: (state) => {
      state.selectedCategoryId = null;
      state.selectedSubcategoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

export const { clearCategories, setSelectedCategory, setSelectedSubcategory, clearSelectedFilters } = categoriesSlice.actions;
export default categoriesSlice.reducer; 