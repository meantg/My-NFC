import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_STORAGE_KEY} from '../utils/const';

export const domainAPI = 'https://apinextap.dispcloud.vn';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${domainAPI}`, // Using the domain API
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async config => {
    // Get token from AsyncStorage
    const token = await tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear stored token
      await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);

      // You can dispatch logout action here if needed
      // dispatch(logout());
    }

    return Promise.reject(error);
  },
);

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: async credentials => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    register: async userData => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },
    logout: async () => {
      const response = await apiClient.post('/auth/logout');
      await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);
      return response.data;
    },
    getProfile: async () => {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    },
    updateProfile: async profileData => {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    },
    forgotPassword: async email => {
      const response = await apiClient.post('/auth/forgot-password', {email});
      return response.data;
    },
    resetPassword: async resetData => {
      const response = await apiClient.post('/auth/reset-password', resetData);
      return response.data;
    },
    changePassword: async passwordData => {
      const response = await apiClient.post(
        '/auth/change-password',
        passwordData,
      );
      return response.data;
    },
  },

  // Device endpoints
  devices: {
    getAll: async () => {
      const response = await apiClient.get('/devices');
      return response.data;
    },
    getById: async id => {
      const response = await apiClient.get(`/devices/${id}`);
      return response.data;
    },
    create: async deviceData => {
      const response = await apiClient.post('/devices', deviceData);
      return response.data;
    },
    update: async (id, deviceData) => {
      const response = await apiClient.put(`/devices/${id}`, deviceData);
      return response.data;
    },
    delete: async id => {
      const response = await apiClient.delete(`/devices/${id}`);
      return response.data;
    },
    writeNfc: async nfcData => {
      const response = await apiClient.post('/devices/write-nfc', nfcData);
      return response.data;
    },
    readNfc: async deviceId => {
      const response = await apiClient.post(`/devices/${deviceId}/read-nfc`);
      return response.data;
    },
  },

  // NFC operations
  nfc: {
    writeData: async nfcData => {
      const response = await apiClient.post('/nfc/write', nfcData);
      return response.data;
    },
    readData: async () => {
      const response = await apiClient.post('/nfc/read');
      return response.data;
    },
    formatTag: async () => {
      const response = await apiClient.post('/nfc/format');
      return response.data;
    },
  },
};

// Token management
export const tokenService = {
  setToken: async token => {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY.AUTH_TOKEN, token);
  },
  getToken: async () => {
    return await AsyncStorage.getItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);
  },
  removeToken: async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);
  },
};

export default apiService;
