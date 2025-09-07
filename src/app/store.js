import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from '../store/api/apiSlice';
import authReducer from '../store/slices/authSlice';
import deviceReducer from '../store/slices/deviceSlice';
import uiReducer from '../store/slices/uiSlice';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    device: deviceReducer,
    ui: uiReducer,
    counter: counterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: __DEV__,
});
