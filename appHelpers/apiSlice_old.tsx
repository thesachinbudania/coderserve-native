import { fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { setToken } from './slices'
import { RootState } from './store';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.coderserve.com/api/accounts',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    const device = (getState() as RootState).user.device;
    const username = (getState() as RootState).user.username;
    if (token) {
      headers.set('AUTHORIZATION', `Bearer ${token}`);
    }
    if (device) {
      headers.set('device', device);
    }
    if (username) {
      headers.set('username', username);
    }
    return headers
  }
})


export const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refresh_token = (api.getState() as RootState).auth.refreshToken;
    const refreshResult: any = await fetch('https://api.coderserve.com/api/accounts/token_generator/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh_token': refresh_token })
    })
    const refreshResultJson = await refreshResult.json();
    if (refreshResultJson.token) {
      const token = refreshResultJson.token.access_token;
      const newRefreshToken = refreshResultJson.token.refresh_token;
      api.dispatch(setToken({ accessToken: token, refreshToken: newRefreshToken }));
      const newResult = await baseQuery(args, api, extraOptions);
      return newResult;
    }
  }
  return result
}
