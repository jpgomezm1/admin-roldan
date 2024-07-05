import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

setupListeners(store.dispatch);

export default store;

