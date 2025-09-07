import {apiSlice} from './apiSlice';

export const domainAPI = 'https://apinextap.nexview.vn';

export const deviceApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // QUERY - Reading data (GET requests)
    getDevices: builder.query({
      query: () => `${domainAPI}/devices`,
      providesTags: ['Device'], // Provides data to cache
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    getDeviceById: builder.query({
      query: id => `${domainAPI}/devices/${id}`,
      providesTags: (result, error, id) => [{type: 'Device', id}],
    }),

    // MUTATION - Modifying data (POST, PUT, DELETE requests)
    createDevice: builder.mutation({
      query: deviceData => ({
        url: `${domainAPI}/devices`,
        method: 'POST',
        body: deviceData,
      }),
      // Optimistic update - immediately add to UI
      async onQueryStarted(deviceData, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          deviceApi.util.updateQueryData('getDevices', undefined, draft => {
            draft.push({
              id: Date.now(), // Temporary ID
              ...deviceData,
              isOptimistic: true, // Mark as optimistic
            });
          }),
        );
        try {
          await queryFulfilled;
          // Success - optimistic update becomes real
        } catch {
          // Error - undo optimistic update
          patchResult.undo();
        }
      },
      invalidatesTags: ['Device'],
    }),

    updateDevice: builder.mutation({
      query: ({id, ...deviceData}) => ({
        url: `${domainAPI}/devices/${id}`,
        method: 'PUT',
        body: deviceData,
      }),
      // Optimistic update
      async onQueryStarted({id, ...deviceData}, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          deviceApi.util.updateQueryData('getDevices', undefined, draft => {
            const device = draft.find(d => d.id === id);
            if (device) {
              Object.assign(device, deviceData);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, {id}) => [
        {type: 'Device', id},
        'Device',
      ],
    }),

    deleteDevice: builder.mutation({
      query: id => ({
        url: `${domainAPI}/devices/${id}`,
        method: 'DELETE',
      }),
      // Optimistic update - immediately remove from UI
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          deviceApi.util.updateQueryData('getDevices', undefined, draft => {
            const index = draft.findIndex(d => d.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Device'],
    }),

    // NFC Operations - These are mutations because they modify the NFC tag
    writeNfcData: builder.mutation({
      query: nfcData => ({
        url: `${domainAPI}/devices/write-nfc`,
        method: 'POST',
        body: nfcData,
      }),
      invalidatesTags: ['Device'],
    }),

    readNfcData: builder.mutation({
      query: deviceId => ({
        url: `${domainAPI}/devices/${deviceId}/read-nfc`,
        method: 'POST',
      }),
      // Don't invalidate cache for read operations
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceByIdQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useWriteNfcDataMutation,
  useReadNfcDataMutation,
} = deviceApi;
