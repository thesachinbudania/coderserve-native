import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';


const authState = {
  refreshToken: '',
  accessToken: '',
}

const authSlice = createSlice({
  initialState: authState,
  name: 'auth',
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      SecureStore.setItemAsync('accessToken', action.payload.accessToken);
      SecureStore.setItemAsync('refreshToken', action.payload.refreshToken);
    },
    clearToken: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
    }
  }
})


export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
