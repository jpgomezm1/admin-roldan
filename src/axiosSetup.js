// src/axiosSetup.js
import axios from 'axios';
import store from './redux/store';
import { logout, login } from './redux/authSlice';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

axios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        const response = await axios.post('/refresh', { refresh_token: refreshToken });
        const { access_token } = response.data;
        store.dispatch(login({ token: access_token, refreshToken }));
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

