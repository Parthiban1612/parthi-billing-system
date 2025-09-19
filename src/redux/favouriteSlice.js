import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS } from './endpoints';
import { axiosConfig } from './endpoints';

// Add to favourites (POST)
export const addFavourite = createAsyncThunk(
  'favourite/addFavourite',
  async (locationId, { rejectWithValue, getState, dispatch }) => {
    const { token } = getState().auth;
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(`${ENDPOINTS.ADD_FAVOURITE}`, { itinerary_id: locationId }, config);
      // Automatically refresh favorites after successful add
      if (response.data?.status === true) {
        dispatch(fetchFavourites());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add favourite');
    }
  }
);

// Remove from favourites (DELETE)
export const removeFavourite = createAsyncThunk(
  'favourite/removeFavourite',
  async (locationId, { rejectWithValue, getState, dispatch }) => {
    const { token } = getState().auth;
    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(`${ENDPOINTS.REMOVE_FAVOURITE}/${locationId}`, config);
      // Automatically refresh favorites after successful remove
      if (response.data?.status === true) {
        dispatch(fetchFavourites());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove favourite');
    }
  }
);

// Fetch all favourites (GET)
export const fetchFavourites = createAsyncThunk(
  'favourite/fetchFavourites',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get(`${ENDPOINTS.GET_FAVOURITES}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...axiosConfig.headers,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favourites');
    }
  }
);

export const getFavourite = createAsyncThunk(
  'favourite/getFavourite',
  async (locationId, { rejectWithValue, getState }) => {

    const { token } = getState().auth;

    try {
      const response = await axios.get(`${ENDPOINTS.GET_FAVOURITE}/${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...axiosConfig.headers,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get favourite');
    }
  }
);

const initialState = {
  favourites: [],
  favourite: null,
  removeLoading: false,
  favouritesLoading: false, // For fetching all favourites
  getFavouriteLoading: false, // For fetching individual favourite details
  addLoading: false,
  error: null,
  favoriteData: null,
};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    clearFavourites: (state) => {
      state.favourites = [];
      state.error = null;
    },

    updateFavourite: (state, action) => {
      const { isFavorite, favouriteId } = action.payload;
      if (state.favourite) {
        state.favourite.data.is_favorite = isFavorite ? true : false;
        state.favourite.data.favorite_id = favouriteId;
      }
    },


  },
  extraReducers: (builder) => {
    builder
      // Add Favourite
      .addCase(addFavourite.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.addLoading = false;
        // The favorites list will be updated by the fetchFavourites call
      })
      .addCase(addFavourite.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })
      // Remove Favourite
      .addCase(removeFavourite.pending, (state) => {
        state.removeLoading = true;
        state.error = null;
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.removeLoading = false;
        // The favorites list will be updated by the fetchFavourites call
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.removeLoading = false;
        state.error = action.payload;
      })
      // Fetch Favourites
      .addCase(fetchFavourites.pending, (state) => {
        state.favouritesLoading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.favouritesLoading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.favouritesLoading = false;
        state.error = action.payload;
      })
      // Get Favourite
      .addCase(getFavourite.pending, (state) => {
        state.getFavouriteLoading = true;
        state.error = null;
      })
      .addCase(getFavourite.fulfilled, (state, action) => {
        state.getFavouriteLoading = false;
        state.favourite = action.payload;
      })
      .addCase(getFavourite.rejected, (state, action) => {
        state.getFavouriteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavourites, updateFavourite, updateFavouriteInItineraries } = favouriteSlice.actions;

export default favouriteSlice.reducer;