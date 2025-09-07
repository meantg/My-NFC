# API Helper with Redux Toolkit

This directory contains a comprehensive API helper system built with Redux Toolkit and RTK Query for managing API calls, state management, and NFC operations.

## 📁 Directory Structure

```
src/store/
├── api/
│   ├── apiSlice.js          # Base API configuration
│   ├── authApi.js           # Authentication endpoints
│   └── deviceApi.js         # Device management endpoints
├── slices/
│   ├── authSlice.js         # Authentication state
│   ├── deviceSlice.js       # Device state
│   └── uiSlice.js           # UI state (modals, loading, notifications)
├── hooks/
│   └── useApi.js            # Custom hook for API operations
├── index.js                 # Redux store configuration
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Store Configuration

The store is configured in `src/store/index.js` and includes:
- RTK Query API slice
- Authentication slice
- Device management slice
- UI state slice

### 2. Using API Hooks

#### Authentication
```javascript
import { useLoginMutation, useRegisterMutation } from '../store/api/authApi';

const [login, { isLoading, error }] = useLoginMutation();

const handleLogin = async () => {
  try {
    const result = await login({ email, password }).unwrap();
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
```

#### Device Management
```javascript
import { 
  useGetDevicesQuery, 
  useCreateDeviceMutation,
  useUpdateDeviceMutation 
} from '../store/api/deviceApi';

// Query devices
const { data: devices, isLoading, error } = useGetDevicesQuery();

// Create device
const [createDevice, { isLoading: isCreating }] = useCreateDeviceMutation();

const handleCreateDevice = async (deviceData) => {
  try {
    const result = await createDevice(deviceData).unwrap();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### 3. Using the Custom API Hook

The `useApi` hook provides centralized error handling and loading states:

```javascript
import { useApi } from '../store/hooks/useApi';

const { handleApiCall, handleNfcOperation, isLoading, error } = useApi();

// Regular API call
const handleLogin = async () => {
  try {
    const result = await handleApiCall(
      () => login({ email, password }),
      {
        showLoading: true,
        showError: true,
        showSuccess: true,
        successMessage: 'Login successful!',
        errorMessage: 'Login failed',
      }
    );
    // Handle success
  } catch (error) {
    // Error is already handled by the hook
  }
};

// NFC operation
const handleNfcWrite = async () => {
  try {
    const result = await handleNfcOperation(
      async () => {
        // Your NFC operation here
        return await writeNdefMessageWithAuth();
      },
      {
        showLoading: true,
        showError: true,
        showSuccess: true,
        successMessage: 'NFC write successful!',
        errorMessage: 'NFC write failed',
      }
    );
    // Handle success
  } catch (error) {
    // Error is already handled by the hook
  }
};
```

## 📋 API Endpoints

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `POST /auth/change-password` - Change password

### Device Endpoints
- `GET /devices` - Get all devices
- `GET /devices/:id` - Get device by ID
- `POST /devices` - Create new device
- `PUT /devices/:id` - Update device
- `DELETE /devices/:id` - Delete device
- `POST /devices/write-nfc` - Write NFC data
- `POST /devices/:id/read-nfc` - Read NFC data

### NFC Endpoints
- `POST /nfc/write` - Write NFC data
- `POST /nfc/read` - Read NFC data
- `POST /nfc/format` - Format NFC tag

## 🔧 Configuration

### Base URL
Update the base URL in `src/store/api/apiSlice.js`:
```javascript
const baseQuery = fetchBaseQuery({
  baseURL: 'https://your-api-domain.com/api/v1',
  // ... other config
});
```

### Token Management
The system automatically handles token management through AsyncStorage:
- Tokens are stored in AsyncStorage
- Request interceptors add Authorization headers
- Response interceptors handle 401 errors

## 🎯 State Management

### Authentication State
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}
```

### Device State
```javascript
{
  devices: [],
  currentDevice: null,
  isLoading: false,
  error: null,
  nfcOperation: {
    isWriting: false,
    isReading: false,
    error: null
  }
}
```

### UI State
```javascript
{
  modals: {
    addDevice: false,
    deviceDetail: false,
    settings: false
  },
  loading: {
    global: false,
    nfc: false
  },
  notifications: [],
  theme: 'light'
}
```

## 🔄 RTK Query Features

### Automatic Caching
- Queries are automatically cached
- Cache invalidation on mutations
- Optimistic updates

### Loading States
- Automatic loading states for queries and mutations
- Global loading state management

### Error Handling
- Centralized error handling
- Automatic error state management
- Retry logic for failed requests

## 📱 Usage Examples

### Complete Device Creation Flow
```javascript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCreateDeviceMutation } from '../store/api/deviceApi';
import { useApi } from '../store/hooks/useApi';
import { addNotification } from '../store/slices/uiSlice';

const AddDeviceScreen = () => {
  const dispatch = useDispatch();
  const { handleApiCall } = useApi();
  const [createDevice, { isLoading }] = useCreateDeviceMutation();
  
  const [deviceData, setDeviceData] = useState({
    name: '',
    type: 'WIFI_SIMPLE',
    wifiData: { ssid: '', password: '' }
  });

  const handleSubmit = async () => {
    try {
      const result = await handleApiCall(
        () => createDevice(deviceData).unwrap(),
        {
          showLoading: true,
          showError: true,
          showSuccess: true,
          successMessage: 'Device created successfully!',
          errorMessage: 'Failed to create device'
        }
      );

      dispatch(addNotification({
        type: 'success',
        message: 'Device created successfully!'
      }));

      // Navigate or close modal
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  return (
    // Your UI components
  );
};
```

### Authentication Flow
```javascript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import { useApi } from '../store/hooks/useApi';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { handleApiCall } = useApi();
  const [login, { isLoading }] = useLoginMutation();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async () => {
    try {
      const result = await handleApiCall(
        () => login(credentials).unwrap(),
        {
          showLoading: true,
          showError: true,
          showSuccess: true,
          successMessage: 'Login successful!',
          errorMessage: 'Login failed'
        }
      );

      // Store credentials in Redux
      dispatch(setCredentials({
        user: result.user,
        token: result.token
      }));

      // Navigate to main app
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  return (
    // Your login UI
  );
};
```

## 🛠️ Customization

### Adding New API Endpoints
1. Create new API slice in `src/store/api/`
2. Add endpoints using RTK Query
3. Export hooks for use in components

### Adding New State Slices
1. Create new slice in `src/store/slices/`
2. Add to store configuration in `src/store/index.js`
3. Export selectors for use in components

### Custom Error Handling
Override the base query in `src/store/api/apiSlice.js` to add custom error handling logic.

## 🔍 Debugging

### Redux DevTools
The store is configured with Redux DevTools for development:
```javascript
devTools: __DEV__
```

### Logging
Add console logs in the `useApi` hook to debug API calls:
```javascript
console.log('API Call:', apiCall);
console.log('Result:', result);
console.log('Error:', error);
```

## 📚 Best Practices

1. **Use RTK Query hooks** for data fetching and mutations
2. **Use the `useApi` hook** for complex operations with error handling
3. **Dispatch notifications** for user feedback
4. **Handle loading states** in UI components
5. **Use selectors** to access state in components
6. **Keep API calls in service layer** for reusability

## 🚨 Error Handling

The system provides multiple levels of error handling:
- **RTK Query level**: Automatic error state management
- **Custom hook level**: Centralized error handling with notifications
- **Component level**: Local error handling for specific cases

## 🔐 Security

- **Token management**: Automatic token storage and retrieval
- **Request interceptors**: Automatic Authorization headers
- **Response interceptors**: Automatic 401 handling
- **Secure storage**: Tokens stored in AsyncStorage

This API helper system provides a robust foundation for managing API calls, state, and NFC operations in your React Native NFC application. 