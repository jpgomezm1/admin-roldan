// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  logo_url: null,
  establecimiento: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.logo_url = action.payload.logo_url;
      state.establecimiento = action.payload.establecimiento;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.logo_url = null;
      state.establecimiento = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;


