import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { LOCAL_STORAGE_KEYS } from '../constants';

interface initialStateType {
  token: null | string;
  mainUserId: null | string;
  isLoggedOut: boolean;
}

const initialState: initialStateType = {
  token: localStorage.getItem(LOCAL_STORAGE_KEYS.Token),
  mainUserId: localStorage.getItem(LOCAL_STORAGE_KEYS.Token)
    ? jwt_decode(localStorage.getItem(LOCAL_STORAGE_KEYS.Token))._id
    : null,
  isLoggedOut: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUserCredentials: (state, action: PayloadAction<string>) => {
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
