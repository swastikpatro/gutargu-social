import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { api } from './api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;
