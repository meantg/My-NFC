import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  devices: [],
  currentDevice: null,
  isLoading: false,
  error: null,
  nfcOperation: {
    isWriting: false,
    isReading: false,
    error: null,
  },
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevices: (state, action) => {
      state.devices = action.payload;
      state.error = null;
    },
    addDevice: (state, action) => {
      state.devices.push(action.payload);
    },
    updateDevice: (state, action) => {
      const {id, ...updates} = action.payload;
      const index = state.devices.findIndex(device => device.id === id);
      if (index !== -1) {
        state.devices[index] = {...state.devices[index], ...updates};
      }
    },
    removeDevice: (state, action) => {
      state.devices = state.devices.filter(
        device => device.id !== action.payload,
      );
    },
    setCurrentDevice: (state, action) => {
      state.currentDevice = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: state => {
      state.error = null;
    },
    setNfcOperation: (state, action) => {
      state.nfcOperation = {...state.nfcOperation, ...action.payload};
    },
    clearNfcOperation: state => {
      state.nfcOperation = {
        isWriting: false,
        isReading: false,
        error: null,
      };
    },
  },
});

export const {
  setDevices,
  addDevice,
  updateDevice,
  removeDevice,
  setCurrentDevice,
  setLoading,
  setError,
  clearError,
  setNfcOperation,
  clearNfcOperation,
} = deviceSlice.actions;

export default deviceSlice.reducer;

// Selectors
export const selectAllDevices = state => state.device.devices;
export const selectCurrentDevice = state => state.device.currentDevice;
export const selectDeviceLoading = state => state.device.isLoading;
export const selectDeviceError = state => state.device.error;
export const selectNfcOperation = state => state.device.nfcOperation;
