import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  modals: {
    addDevice: false,
    deviceDetail: false,
    settings: false,
  },
  loading: {
    global: false,
    nfc: false,
  },
  notifications: [],
  theme: 'light', // or 'dark'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalVisible: (state, action) => {
      const {modalName, visible} = action.payload;
      state.modals[modalName] = visible;
    },
    setLoading: (state, action) => {
      const {type, loading} = action.payload;
      state.loading[type] = loading;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload,
      );
    },
    clearNotifications: state => {
      state.notifications = [];
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setModalVisible,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectModalVisible = state => state.ui.modals;
export const selectLoading = state => state.ui.loading;
export const selectNotifications = state => state.ui.notifications;
export const selectTheme = state => state.ui.theme;
