import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';

// Fetch travel countries from API
export const fetchTravelCountries = createAsyncThunk(
  'travelCountries/fetchTravelCountries',
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
      const response = await axios.get(ENDPOINTS.TRAVEL_COUNTRIES, config);
      return response.data;
    } catch (error) {
      console.log('error', JSON.stringify(error?.response, null, 2));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch travel countries'
      );
    }
  }
);

export const fetchQuestions = createAsyncThunk(
  'travelCountries/fetchQuestions',
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
      const response = await axios.get(ENDPOINTS.GET_QUESTIONS, config);
      return response.data;
    } catch (error) {
      console.log('error', JSON.stringify(error, null, 2));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch questions'
      );
    }
  }
);

// Fetch travel countries from API
export const submitUserCountry = createAsyncThunk(
  'travelCountries/submitUserCountry',
  async ({ selectedCountry }, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.post(ENDPOINTS.SUBMIT_USER_COUNTRY, {
        country_id: selectedCountry?.id
      }, config);

      return { selectedCountry, response: response.data };
    } catch (error) {
      console.log("error", JSON.stringify(error, null, 2));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit user country'
      );
    }
  }
);

// Fetch all itineraries from API 
export const getAllItineraries = createAsyncThunk(
  'itineraries/getAllItineraries',
  async ({ categoryId, cityId, subcategoryId, token }, { rejectWithValue }) => {

    let url = ENDPOINTS.GET_ALL_ITINERARIES;
    const params = new URLSearchParams();

    if (categoryId) {
      params.append('category', categoryId);
    }
    if (cityId) {
      params.append('city', cityId);
    }

    if (subcategoryId && categoryId === 13) {
      params.append('sub_category', 'hidden_gem');
    } else {
      params.append('sub_category', subcategoryId);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(url, config);

      return response.data;
    } catch (error) {
      console.log('error', JSON.stringify(error?.response, null, 2));
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all itineraries'
      );
    }
  }
);


export const submitUserPreference = createAsyncThunk(
  'travelCountries/submitUserPreference',
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
      const response = await axios.post(ENDPOINTS.SUBMIT_USER_PREFERENCE, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit user preference'
      );
    }
  }
);

export const getSubmittedCountry = createAsyncThunk(
  'travelCountries/getSubmittedCountry',
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
      const response = await axios.get(ENDPOINTS.GET_USER_SELECTED_COUNTRY, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get submitted country'
      );
    }
  }
);

const travelCountriesSlice = createSlice({
  name: 'travelCountries',
  initialState: {
    travelCountries: [],
    selectedCountry: null, // Will now store the full country object
    selectedCity: null, // Store the selected city ID or city object
    loading: false,
    submitLoading: false,
    itinerariesLoading: false, // Separate loading state for itineraries
    error: null,
    isSheetOpen: false,
    itineraries: [],
    questions: [],
    questionsLoading: false,
    questionsError: null,
    submittedCountry: null,
    submittedCountryLoading: false,
    submittedCountryError: null,
  },
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload; // Now stores the full country object
    },
    clearSelectedCountry: (state) => {
      state.selectedCountry = null;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearSelectedCity: (state) => {
      state.selectedCity = null;
    },
    clearTravelCountriesError: (state) => {
      state.error = null;
    },
    setIsSheetOpen: (state, action) => {
      state.isSheetOpen = action.payload;
    },
    clearTravelCountries: (state) => {
      state.travelCountries = [];
      state.selectedCountry = null;
      state.selectedCity = null;
      state.loading = false;
      state.error = null;
    },
    clearPersistedData: (state) => {
      state.selectedCountry = null;
      state.selectedCity = null;
      state.travelCountries = [];
    },

    updateFavouriteInItineraries: (state, action) => {
      const { isFavorite, favouriteId } = action.payload;
      if (state.itineraries) {
        state.itineraries.data.itineraries.forEach(itinerary => {
          if (itinerary.id === favouriteId) {
            itinerary.is_favorite = isFavorite;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.travelCountries = action.payload.data || action.payload || [];
        state.error = null;
      })
      .addCase(fetchTravelCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch travel countries';
      })
      .addCase(submitUserCountry.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitUserCountry.fulfilled, (state, action) => {
        state.submittedCountry = action.payload.selectedCountry;
        state.submitLoading = false;
        state.error = null;
      })
      .addCase(submitUserCountry.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload || 'Failed to submit user country';
      })
      .addCase(getAllItineraries.pending, (state) => {
        state.itinerariesLoading = true;
        state.error = null;
      })
      .addCase(getAllItineraries.fulfilled, (state, action) => {
        state.itinerariesLoading = false;
        state.itineraries = action.payload;
        state.error = null;
      })
      .addCase(getAllItineraries.rejected, (state, action) => {
        state.itinerariesLoading = false;
        state.error = action.payload || 'Failed to fetch all itineraries';
      })
      .addCase(fetchQuestions.pending, (state) => {
        state.questionsLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questionsLoading = false;
        state.questions = action.payload;
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.questionsLoading = false;
        state.error = action.payload || 'Failed to fetch questions';
      })
      .addCase(submitUserPreference.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitUserPreference.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.error = null;
      })
      .addCase(submitUserPreference.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload || 'Failed to submit user preference';
      })
      .addCase(getSubmittedCountry.pending, (state) => {
        state.submittedCountryLoading = true;
        state.error = null;
      })
      .addCase(getSubmittedCountry.fulfilled, (state, action) => {
        state.submittedCountryLoading = false;
        state.submittedCountry = action.payload.data;
        state.error = null;
      })
      .addCase(getSubmittedCountry.rejected, (state, action) => {
        state.submittedCountryLoading = false;
        state.error = action.payload || 'Failed to get submitted country';
      });
  },
});

export const {
  setSelectedCountry,
  clearSelectedCountry,
  setSelectedCity,
  clearSelectedCity,
  clearTravelCountriesError,
  clearTravelCountries,
  setIsSheetOpen,
  updateFavouriteInItineraries,
} = travelCountriesSlice.actions;

// Utility function to clear persisted data (useful for debugging)
export const clearPersistedData = () => {
  return {
    type: 'travelCountries/clearPersistedData',
    payload: null,
  };
};

export default travelCountriesSlice.reducer;  