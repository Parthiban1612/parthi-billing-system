import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeIndex: 0,
};

const carouselSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
  },
});

export const { setActiveIndex } = carouselSlice.actions;
export default carouselSlice.reducer; 