import {useDispatch, useSelector} from 'react-redux';
import {setLoading, setError, clearError} from '../slices/authSlice';
import {setModalVisible, addNotification} from '../slices/uiSlice';

export const useApi = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);
  const error = useSelector(state => state.auth.error);

  const handleApiCall = async (apiCall, options = {}) => {
    const {
      showLoading = true,
      showError = true,
      showSuccess = false,
      successMessage = 'Operation completed successfully',
      errorMessage = 'An error occurred',
    } = options;

    try {
      if (showLoading) {
        dispatch(setLoading(true));
      }
      dispatch(clearError());

      const result = await apiCall();

      if (showSuccess) {
        dispatch(
          addNotification({
            type: 'success',
            message: successMessage,
          }),
        );
      }

      return result;
    } catch (err) {
      const errorMsg = err?.data?.message || err?.message || errorMessage;

      if (showError) {
        dispatch(setError(errorMsg));
        dispatch(
          addNotification({
            type: 'error',
            message: errorMsg,
          }),
        );
      }

      throw err;
    } finally {
      if (showLoading) {
        dispatch(setLoading(false));
      }
    }
  };

  const handleNfcOperation = async (operation, options = {}) => {
    const {
      showLoading = true,
      showError = true,
      showSuccess = false,
      successMessage = 'NFC operation completed successfully',
      errorMessage = 'NFC operation failed',
    } = options;

    try {
      if (showLoading) {
        dispatch(setLoading({type: 'nfc', loading: true}));
      }
      dispatch(clearError());

      const result = await operation();

      if (showSuccess) {
        dispatch(
          addNotification({
            type: 'success',
            message: successMessage,
          }),
        );
      }

      return result;
    } catch (err) {
      const errorMsg = err?.message || errorMessage;

      if (showError) {
        dispatch(setError(errorMsg));
        dispatch(
          addNotification({
            type: 'error',
            message: errorMsg,
          }),
        );
      }

      throw err;
    } finally {
      if (showLoading) {
        dispatch(setLoading({type: 'nfc', loading: false}));
      }
    }
  };

  return {
    handleApiCall,
    handleNfcOperation,
    isLoading,
    error,
  };
};
