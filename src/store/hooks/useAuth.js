/* eslint-disable no-catch-shadow */
import {useDispatch, useSelector} from 'react-redux';
import {
  loginUser,
  logoutUserAsync,
  fetchUserProfile,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthToken,
  registerUserAsync,
  refreshTokenAsync,
  verifyOTPAsync,
  resetOTPAsync,
} from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const token = useSelector(selectAuthToken);

  const resetOTP = async email => {
    try {
      // @ts-ignore
      const result = await dispatch(resetOTPAsync(email)).unwrap();
      return {success: true, data: result};
    } catch (error) {
      return {success: false, error: error.message || 'Reset OTP failed'};
    }
  };

  const verifyOTP = async ({otp, email}) => {
    try {
      // @ts-ignore
      const result = await dispatch(verifyOTPAsync({otp, email})).unwrap();
      return {success: true, data: result};
    } catch (error) {
      return {success: false, error: error.message || 'Verify OTP failed'};
    }
  };

  const login = async ({username, password}) => {
    try {
      // @ts-ignore
      const result = await dispatch(
        // @ts-ignore
        loginUser({
          username,
          password,
        }),
      ).unwrap();
      return {success: true, data: result};
    } catch (error) {
      return {success: false, error: error.message || 'Login failed'};
    }
  };

  const logout = async () => {
    if (!token) {
      return {success: false, error: 'No token to logout'};
    }

    try {
      // @ts-ignore
      await dispatch(logoutUserAsync(token)).unwrap();
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message || 'Logout failed'};
    }
  };

  const register = async ({
    userData = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  }) => {
    try {
      // @ts-ignore
      const result = await dispatch(registerUserAsync({userData})).unwrap();
      return {success: true, data: result};
    } catch (error) {
      return {success: false, error: error.message || 'Register failed'};
    }
  };

  const refreshToken = async () => {
    try {
      // @ts-ignore
      const result = await dispatch(refreshTokenAsync(token)).unwrap();
      return {success: true, data: result};
    } catch (error) {
      return {success: false, error: error.message || 'Refresh token failed'};
    }
  };

  const getProfile = async () => {
    if (!token) {
      return {success: false, error: 'No token available'};
    }

    try {
      // @ts-ignore
      const result = await dispatch(fetchUserProfile({token})).unwrap();
      return {success: true, data: result};
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch profile',
      };
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    token,

    // Actions
    verifyOTP,
    login,
    logout,
    getProfile,
    register,
    refreshToken,
    resetOTP,
  };
};
