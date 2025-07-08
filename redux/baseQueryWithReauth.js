
// src/redux/baseQueryWithReauth.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from './auth/authSlice';
import { BASE_URL } from '@/constants/apiUrls';

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log("Token in baseQueryWithReauth:", getState()?.auth);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Get refresh token from state
    const refreshToken = api.getState().auth.refreshToken;

    if (refreshToken) {
      // Attempt token refresh
      const refreshResult = await baseQuery(
        {
          url: '/api/employee/refreshToken', // Your refresh token endpoint
          method: 'POST',
          body: { refreshToken }, // Include the refresh token in the request body
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken, refreshToken: newRefreshToken, formattedEmployee } = refreshResult.data;

        // Store the new tokens
        api.dispatch(
          setCredentials({
            user: formattedEmployee,
            token: accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh fails, log the user out
        api.dispatch(logOut());
        api.util.resetApiState()
      }
    } else {
      // No refresh token, log the user out
      api.dispatch(logOut());
      api.util.resetApiState()
    }
  }

  return result;
};
