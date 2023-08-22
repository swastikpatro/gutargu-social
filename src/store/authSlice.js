import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { LOCAL_STORAGE_KEYS } from '../constants';
import {
  localStorageGetItemWithExpiry,
  localStorageSetItemWithExpiry,
} from '../utils/utils';

const initialState = {
  token: localStorageGetItemWithExpiry(LOCAL_STORAGE_KEYS.Token),
  mainUserId: localStorageGetItemWithExpiry(LOCAL_STORAGE_KEYS.Token)
    ? jwt_decode(localStorageGetItemWithExpiry(LOCAL_STORAGE_KEYS.Token))._id
    : null,
  isLoggedOut: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUserCredentials: (state, action) => {
      localStorageSetItemWithExpiry(LOCAL_STORAGE_KEYS.Token, action.payload);
      state.token = action.payload;
      state.mainUserId = jwt_decode(action.payload)._id;
    },
    updateLogOutStatus: (state) => {
      state.isLoggedOut = !state.isLoggedOut;
    },
    removeUserCredentials: (state) => {
      state.token = null;
      state.mainUserId = null;
      localStorage.removeItem(LOCAL_STORAGE_KEYS.Token);
    },
  },
});

export const { addUserCredentials, removeUserCredentials, updateLogOutStatus } =
  authSlice.actions;

export default authSlice.reducer;
