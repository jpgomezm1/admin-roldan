import axios from 'axios';
import store from './redux/store';
import { login, logout } from './redux/authSlice';

const refreshToken = async (dispatch) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
      }
    });
    const { access_token } = response.data;
    dispatch(login({ token: access_token }));
    localStorage.setItem('access_token', access_token);
  } catch (error) {
    console.error('Error refreshing token', error);
    dispatch(logout());
  }
};

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshToken(store.dispatch);
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
