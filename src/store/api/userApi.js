import {apiClient} from '../../services/apiService';

// API call to get posts (you can create other methods similarly)
export const adminCreateNewTagDevice = async (
  tagData = {type: '', uid: ''},
) => {
  let response;
  try {
    response = await apiClient.post('/v1/products/create-product', tagData);
    return response.data;
  } catch (error) {
    console.log('api adminCreateNewTagDevice error', error);
    return {success: false, ...error.response.data};
  }
};

export const userCreateNewTagDevice = async (
  tagData = {
    name: 'test',
    data: 'balaba',
    key: '123',
    uid: '234',
    groupId: '68beaa707fd73cfb1867d763',
  },
) => {
  let response;
  try {
    response = await apiClient.put('/v1/products/active-product', tagData);
    return response.data;
  } catch (error) {
    console.log('api userCreateNewTagDevice error', error);
    return {success: false, ...error.response.data};
  }
};

export const updateTagDevice = async (
  tagData = {name: '', data: '', key: '', uid: '', groupId: ''},
) => {
  let response;
  try {
    response = await apiClient.put(
      `/v1/products/update/${tagData.uid}`,
      tagData,
    );
    return response.data;
  } catch (error) {
    console.log('api updateTagDevice error', error);
    return {success: false, ...error.response.data};
  }
};

export const moveTagDevice = async (locationData = {groupId: ''}) => {
  let response;
  try {
    response = await apiClient.put(
      `/v1/products/move-to-group/${locationData.groupId}`,
      locationData,
    );
    return response.data;
  } catch (error) {
    console.log('api moveTagDevice error', error);
    return {success: false, ...error.response.data};
  }
};

export const getBackTagDeviceKey = async uid => {
  let response;
  try {
    response = await apiClient.get(`/v1/products/get-key/${uid}`);
    return response.data;
  } catch (error) {
    console.log('api getBackTagDeviceKey error', error);
    return {success: false, ...error.response.data};
  }
};

export const deleteTagDevice = async uid => {
  let response;
  try {
    response = await apiClient.put(`/v1/products/delete/${uid}`);
    return response.data;
  } catch (error) {
    console.log('api deleteTagDevice error', error);
    return {success: false, ...error.response.data};
  }
};

export const checkUID = async uid => {
  let response;
  try {
    response = await apiClient.get(`/v1/products/check-product-uid/${uid}`);
    return response.data;
  } catch (error) {
    console.log('api checkUID error', error);
    return {success: false, ...error.response.data};
  }
};

export const createNewLocation = async (locationData = {name: ''}) => {
  let response;
  try {
    response = await apiClient.post('/v1/group-products/create', locationData);
    return response.data;
  } catch (error) {
    console.log('api createNewLocation error', error);
    return {success: false, ...error.response.data};
  }
};

export const updateLocation = async (locationId, locationData = {name: ''}) => {
  let response;
  try {
    response = await apiClient.put(`/v1/group-products/update/${locationId}`, {
      name: locationData.name,
    });
    return response.data;
  } catch (error) {
    console.log('api updateLocation error', error);
    return {success: false, ...error.response.data};
  }
};

export const deleteLocation = async locationId => {
  let response;
  try {
    response = await apiClient.delete(
      `/v1/group-products/delete/${locationId}`,
    );
    return response.data;
  } catch (error) {
    console.log('api deleteLocation error', error);
    return {success: false, ...error.response.data};
  }
};

export const pushProductToNfc = async arrayData => {
  let response;
  try {
    response = await apiClient.put('/v1/group-products/push-product', arrayData);
    return response.data;
  } catch (error) {
    console.log('api pushProductToNfc error', error);
    return {success: false, ...error.response.data};
  }
};

export const getListProducts = async () => {
  let response;
  try {
    response = await apiClient.get('/v1/group-products');
    return response.data;
  } catch (error) {
    console.log('api getListProducts error', error);
    return {success: false, ...error.response.data};
  }
};

export const postConvertSVGToImage = async svgData => {
  let response;
  try {
    response = await apiClient.post('/v1/images/convert-image', svgData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.log('api postConvertSVGToImage error', error);
    return {success: false, ...error.response.data};
  }
};
