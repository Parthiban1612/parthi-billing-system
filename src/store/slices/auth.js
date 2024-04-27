import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../api.js";

const initialState = {
   authDetails: {},
   error: null,
   loading: false,
};

export const createTrundlerProfile = createAsyncThunk(
   "auth/login",
   async (values) => {
      const config = {
         header: {
            "Content-Type": "multipart/form-data",
         },
      };
      try {
         const res = await axios.post(
            Config.CREATE_TRUNDLER_PROFILE,
            values,
            config
         );
         return res;
      } catch (err) {
         return err.response;
      }
   }
);

const loginSice = createSlice({
   name: "authenticate",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(createTrundlerProfile.pending, (state) => {
         state.loading = true;
         state.otpRes = {};
         state.error = null;
      });
      builder.addCase(createTrundlerProfile.fulfilled, (state, { payload }) => {
         state.loading = false;
         state.otpRes = payload;
         state.error = null;
      });
      builder.addCase(createTrundlerProfile.rejected, (state, { payload }) => {
         state.loading = false;
         state.otpRes = {};
         state.error = payload;
      });
   },
});

const { reducer } = loginSice;
export default reducer;
