import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const domainAPI = 'https://apinextap.nexview.vn';

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: `${domainAPI}/api/v1`, // Using the domain API
  prepareHeaders: (headers, {getState}) => {
    // Get token from auth state
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Custom base query with error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Handle unauthorized access - could trigger logout
    console.log('Unauthorized access detected');
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Device', 'User', 'Auth'],
  endpoints: () => ({}),
});
