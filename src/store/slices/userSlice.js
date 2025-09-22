/* @ts-nocheck */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  adminCreateNewTagDevice,
  userCreateNewTagDevice,
  updateTagDevice,
  moveTagDevice,
  getBackTagDeviceKey,
  deleteTagDevice,
  checkUID,
  createNewLocation,
  updateLocation,
  deleteLocation,
  getListProducts,
} from '../api/userApi';

const initialState = {
  items: [],
  currentKey: {},
  lastCheckedUID: {},
  isLoading: false,
  error: null,
};

export const fetchProductsAsync = createAsyncThunk(
  'user/fetchProducts',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getListProducts();
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to fetch products',
      });
    }
  },
);

export const adminCreateTagAsync = createAsyncThunk(
  'user/adminCreateTag',
  async (tagData, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await adminCreateNewTagDevice(tagData);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Admin create tag failed',
      });
    }
  },
);

export const userActivateTagAsync = createAsyncThunk(
  'user/userActivateTag',
  async (tagData, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await userCreateNewTagDevice(tagData);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Activate tag failed',
      });
    }
  },
);

export const updateTagAsync = createAsyncThunk(
  'user/updateTag',
  async (tagData, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await updateTagDevice(tagData);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Update tag failed',
      });
    }
  },
);

export const moveTagAsync = createAsyncThunk(
  'user/moveTag',
  async (locationData, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await moveTagDevice(locationData);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Move tag failed',
      });
    }
  },
);

export const getTagKeyAsync = createAsyncThunk(
  'user/getTagKey',
  async (uid, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await getBackTagDeviceKey(uid);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return {uid, data: response};
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Get tag key failed',
      });
    }
  },
);

export const deleteTagAsync = createAsyncThunk(
  'user/deleteTag',
  async (uid, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await deleteTagDevice(uid);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return {uid, data: response};
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Delete tag failed',
      });
    }
  },
);

export const checkUIDAsync = createAsyncThunk(
  'user/checkUID',
  async (uid, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await checkUID(uid);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return {uid, data: response};
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Check UID failed',
      });
    }
  },
);

export const createLocationAsync = createAsyncThunk(
  'user/createLocation',
  async (locationData, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await createNewLocation(locationData);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Create location failed',
      });
    }
  },
);

export const updateLocationAsync = createAsyncThunk(
  'user/updateLocation',
  async (payload, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const {locationId, locationData} = payload || {};
      // @ts-ignore
      const response = await updateLocation(locationId, locationData);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return {locationId, data: response};
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Update location failed',
      });
    }
  },
);

export const deleteLocationAsync = createAsyncThunk(
  'user/deleteLocation',
  async (locationId, {rejectWithValue}) => {
    try {
      // @ts-ignore
      const response = await deleteLocation(locationId);
      if (response?.success === false) {
        return rejectWithValue(response);
      }
      return {locationId, data: response};
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Delete location failed',
      });
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetKey: state => {
      state.currentKey = {};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProductsAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.data || action.payload || [];
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      .addCase(getTagKeyAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTagKeyAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentKey = action.payload?.data;
      })
      .addCase(getTagKeyAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Get tag key failed';
      })
      .addCase(checkUIDAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUIDAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastCheckedUID = action.payload;
      })
      .addCase(checkUIDAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Check UID failed';
      })
      .addCase(adminCreateTagAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminCreateTagAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(adminCreateTagAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Admin create tag failed';
      })
      .addCase(userActivateTagAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userActivateTagAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(userActivateTagAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Activate tag failed';
      })
      .addCase(updateTagAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTagAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(updateTagAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Update tag failed';
      })
      .addCase(moveTagAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveTagAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(moveTagAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Move tag failed';
      })
      .addCase(deleteTagAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTagAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(deleteTagAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Delete tag failed';
      })
      .addCase(createLocationAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLocationAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(createLocationAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Create location failed';
      })
      .addCase(updateLocationAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLocationAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(updateLocationAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Update location failed';
      })
      .addCase(deleteLocationAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLocationAsync.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(deleteLocationAsync.rejected, (state, action) => {
        state.isLoading = false;
        // @ts-ignore
        state.error = action.payload?.message || 'Delete location failed';
      });
  },
});

export const {clearError, resetKey} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUserItems = state => state.user.items;
export const selectUserIsLoading = state => state.user.isLoading;
export const selectUserError = state => state.user.error;
export const selectUserCurrentKey = state => state.user.currentKey;
export const selectUserLastCheckedUID = state => state.user.lastCheckedUID;
