import axios from 'axios';
import store from './redux/store';

axios.defaults.baseURL = 'https://your-backend-url.com';

axios.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

