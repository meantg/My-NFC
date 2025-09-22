import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import userReducer from '../store/slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: __DEV__,
});
