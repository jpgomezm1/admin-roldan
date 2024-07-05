import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  logo_url: null,
  establecimiento: null,  // Nuevo campo para el nombre del establecimiento
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.logo_url = action.payload.logo_url;
      state.establecimiento = action.payload.establecimiento;  // Guardar el nombre del establecimiento
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.logo_url = null;
      state.establecimiento = null;  // Limpiar el nombre del establecimiento
    }
  }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;


