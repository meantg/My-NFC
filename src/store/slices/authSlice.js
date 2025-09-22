import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  loginWithUsernamePassword,
  logoutUser,
  registerUser,
  getUserProfile,
  refreshUserToken,
  verifyOTP,
  resetOTP,
} from '../api/authApi';
import {tokenService} from '../../services/apiService';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const verifyOTPAsync = createAsyncThunk(
  'auth/verifyOTP',
  // @ts-ignore
  async ({otp, email}, {rejectWithValue}) => {
    try {
      const response = await verifyOTP({otp, email});
      if (response.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Verify OTP failed',
      });
    }
  },
);

export const resetOTPAsync = createAsyncThunk(
  'auth/resetOTP',
  async (email, {rejectWithValue}) => {
    try {
      const response = await resetOTP(email);
      if (response.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Reset OTP failed',
      });
    }
  },
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  // @ts-ignore
  async ({username, password}, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await loginWithUsernamePassword({
        username,
        password,
      });

      if (response.success === false) {
        return rejectWithValue(response);
      }

      // Store token in AsyncStorage
      if (response.refreshToken) {
        await tokenService.setToken(response.refreshToken);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  },
);

// Async thunk for register
export const registerUserAsync = createAsyncThunk(
  'auth/registerUser',
  // @ts-ignore
  async ({userData}, {rejectWithValue}) => {
    try {
      const response = await registerUser({userData});
      if (response.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Register failed',
      });
    }
  },
);
// Async thunk for logout
export const logoutUserAsync = createAsyncThunk(
  'auth/logoutUser',
  async (token, {rejectWithValue}) => {
    try {
      const response = await logoutUser(token);

      // Remove token from AsyncStorage
      await tokenService.removeToken();

      return response;
    } catch (error) {
      // Even if logout API fails, we should still clear local data
      await tokenService.removeToken();
      return rejectWithValue({
        success: false,
        message: error.message || 'Logout failed',
      });
    }
  },
);

// Async thunk for getting user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  // @ts-ignore
  async ({token}, {rejectWithValue}) => {
    try {
      const response = await getUserProfile({token});

      if (response.success === false) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to fetch profile',
      });
    }
  },
);

// Async thunk for refresh token

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (token, {rejectWithValue}) => {
    try {
      const response = await refreshUserToken(token);
      if (response.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Refresh token failed',
      });
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {user, token} = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Login cases
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Login failed';
      })
      // Logout cases
      .addCase(logoutUserAsync.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUserAsync.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Logout failed';
      })
      // Profile cases
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Failed to fetch profile';
      });
  },
});

export const {setCredentials, setLoading, setError, logout, clearError} =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = state => state.auth.user;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthToken = state => state.auth.user?.accessToken;
export const selectAuthLoading = state => state.auth.isLoading;
export const selectAuthError = state => state.auth.error;
