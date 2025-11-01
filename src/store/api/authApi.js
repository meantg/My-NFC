import {apiClient} from '../../services/apiService';

// API call to get posts (you can create other methods similarly)

export const loginWithUsernamePassword = async ({
  username,
  password,
  location,
  deviceID,
  token,
}) => {
  let response;
  try {
    response = await apiClient.post('/v1/mobile/users/login', {
      email: username,
      password: password,
    });
    return response.data; // Return the data if successful
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const logoutUser = async token => {
  let response;
  try {
    response = await apiClient.delete('/v1/mobile/users/logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const registerUser = async ({
  userData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  },
}) => {
  let response;
  try {
    response = await apiClient.post('/v1/users/register', userData);
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const refreshUserToken = async token => {
  let response;
  try {
    response = await apiClient.post('/v1/mobile/users/refresh-token', {
      refreshToken: token,
    });
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const verifyOTP = async ({otp, email}) => {
  let response;
  try {
    response = await apiClient.put('/v1/users/verify', {
      otp,
      email,
    });
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const resetOTP = async email => {
  let response;
  try {
    response = await apiClient.put('/v1/users/reset-otp', {email});
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const getUserProfile = async ({token}) => {
  let response;
  try {
    response = await apiClient.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const updateUserProfile = async ({firstName, lastName}) => {
  let response;
  try {
    response = await apiClient.put('/v1/users/update', {
      firstName,
      lastName,
    });
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const forgotUserPassword = async ({email}) => {
  let response;
  try {
    response = await apiClient.post('/v1/users/reset-password', {email});
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const resetUserPassword = async ({resetData}) => {
  let response;
  try {
    response = await apiClient.post('/auth/reset-password', resetData);
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};

export const changeUserPassword = async ({currentPassword, newPassword}) => {
  let response;
  try {
    response = await apiClient.put('/v1/users/update', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.log('API Fetch Error:', error);
    return {success: false, ...error.response.data};
  }
};
