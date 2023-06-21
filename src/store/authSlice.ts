import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { LOCAL_STORAGE_KEYS } from '../constants';

interface initialStateType {
  token: null | string;
  mainUserId: null | string;
}

const initialState: initialStateType = {
  token: localStorage.getItem(LOCAL_STORAGE_KEYS.Token),
  mainUserId: localStorage.getItem(LOCAL_STORAGE_KEYS.Token)
    ? jwt_decode(localStorage.getItem(LOCAL_STORAGE_KEYS.Token))._id
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUserCredentials: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.mainUserId = jwt_decode(action.payload)._id;
    },
    removeUserCredentials: (state) => {
      state.token = null;
      state.mainUserId = null;
    },
  },
});

export const { addUserCredentials, removeUserCredentials } = authSlice.actions;

export default authSlice.reducer;
