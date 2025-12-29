/* eslint-disable no-catch-shadow */
/* @ts-nocheck */
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchProductsAsync,
  adminCreateTagAsync,
  userActivateTagAsync,
  updateTagAsync,
  moveTagAsync,
  getTagKeyAsync,
  deleteTagAsync,
  checkUIDAsync,
  createLocationAsync,
  updateLocationAsync,
  deleteLocationAsync,
  selectUserItems,
  selectUserIsLoading,
  selectUserError,
  selectUserCurrentKey,
  selectUserLastCheckedUID,
  clearError,
  resetKey,
  pushProductToNfcAsync,
} from '../slices/userSlice';

export const useUser = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectUserItems);
  const isLoading = useSelector(selectUserIsLoading);
  const error = useSelector(selectUserError);
  const currentKey = useSelector(selectUserCurrentKey);
  const lastCheckedUID = useSelector(selectUserLastCheckedUID);

  const fetchProducts = async () => {
    try {
      // @ts-ignore
      const result = await dispatch(fetchProductsAsync()).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Fetch products failed'};
    }
  };

  const adminCreateTag = async tagData => {
    try {
      // @ts-ignore
      const result = await dispatch(adminCreateTagAsync(tagData)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Admin create tag failed',
      };
    }
  };

  const userActivateTag = async tagData => {
    try {
      // @ts-ignore
      const result = await dispatch(userActivateTagAsync(tagData)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Activate tag failed'};
    }
  };

  const updateTag = async tagData => {
    try {
      // @ts-ignore
      const result = await dispatch(updateTagAsync(tagData)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Update tag failed'};
    }
  };

  const moveTag = async locationData => {
    try {
      // @ts-ignore
      const result = await dispatch(moveTagAsync(locationData)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Move tag failed'};
    }
  };

  const getTagKey = async uid => {
    try {
      // @ts-ignore
      const result = await dispatch(getTagKeyAsync(uid)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Get tag key failed'};
    }
  };

  const deleteTag = async uid => {
    try {
      // @ts-ignore
      const result = await dispatch(deleteTagAsync(uid)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Delete tag failed'};
    }
  };

  const checkUID = async uid => {
    try {
      // @ts-ignore
      const result = await dispatch(checkUIDAsync(uid)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Check UID failed'};
    }
  };

  const createLocation = async locationData => {
    try {
      // @ts-ignore
      const result = await dispatch(createLocationAsync(locationData)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Create location failed'};
    }
  };

  const updateLocation = async ({locationId, locationData}) => {
    try {
      // @ts-ignore
      const result = await dispatch(
        // @ts-ignore
        updateLocationAsync({locationId, locationData}),
      ).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Update location failed'};
    }
  };

  const deleteLocation = async locationId => {
    try {
      // @ts-ignore
      const result = await dispatch(deleteLocationAsync(locationId)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Delete location failed'};
    }
  };

  const pushProductToNfc = async arrayData => {
    try {
      // @ts-ignore
      const result = await dispatch(pushProductToNfcAsync(arrayData)).unwrap();
      return {success: true, data: result};
    } catch (err) {
      return {success: false, error: err.message || 'Push product to NFC failed'};
    }
  };

  const clearUserError = () => {
    dispatch(clearError());
  };

  const resetCurrentKey = () => {
    dispatch(resetKey());
  };

  return {
    // state
    items,
    isLoading,
    error,
    currentKey,
    lastCheckedUID,

    // actions
    fetchProducts,
    adminCreateTag,
    userActivateTag,
    updateTag,
    moveTag,
    getTagKey,
    deleteTag,
    checkUID,
    createLocation,
    updateLocation,
    deleteLocation,
    pushProductToNfc,
    clearUserError,
    resetCurrentKey,
  };
};
