import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';
import Toast from 'react-native-toast-message';

// Async thunk for initiating payment
export const initiatePayment = createAsyncThunk(
  'payment/initiate',
  async ({ rejectWithValue, getState }) => {
    try {

      const { token } = getState().auth;

      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.post(ENDPOINTS.INITIATE_PAYMENT, {}, config);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async (data, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.post(ENDPOINTS.RZP_CONFIRM_PAYMENT, data, config);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for confirming payment
export const confirmPayment = createAsyncThunk(
  'payment/confirm',
  async (confirmationData, { rejectWithValue, getState }) => {
    try {

      const { token } = getState().auth;


      const response = await axios.post(ENDPOINTS.CONFIRM_PAYMENT, {
        data: {
          order_id: confirmationData.order_id,
          payment_id: confirmationData.payment_id,
          signature: confirmationData.signature,
          status: confirmationData.status,
          amount: confirmationData.amount
        }
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPlans = createAsyncThunk(
  'payment/getPlans',
  async (_, { rejectWithValue, getState }) => {

    const { token } = getState().auth;

    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(ENDPOINTS.GET_PLANS, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCompletedTrips = createAsyncThunk(
  'payment/getCompletedTrips',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.get(ENDPOINTS.COMPLETED_TRIPS, config);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  'payment/getPaymentHistory',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;

      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.get(ENDPOINTS.GET_PAYMENT_HISTORY, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const downloadInvoice = createAsyncThunk(
  'payment/downloadInvoice',
  async (id, { rejectWithValue, getState }) => {
    const ReactNativeBlobUtil = require('react-native-blob-util').default;
    const { Platform, Alert, PermissionsAndroid } = require('react-native');
    try {
      const { token } = getState().auth;
      // Check and request permission for Android
      if (Platform.OS === 'android' && Platform.Version < 30) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'File Download Permission',
            message: 'Your permission is required to save invoice to your device',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to download invoice. Please enable it in app settings.',
            [{ text: 'OK' }]
          );
          return rejectWithValue('Storage permission denied');
        }
      }

      // Get the app's download directory
      const { config, fs } = ReactNativeBlobUtil;
      const downloadDir = Platform.select({
        ios: fs.dirs.DocumentDir,
        android: fs.dirs.DownloadDir,
      });

      const filename = `invoice_${id}_${Date.now()}.pdf`;
      const filePath = `${downloadDir}/${filename}`;

      // Prepare axios config for PDF download
      const downloadConfig = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Use blob for better React Native compatibility
      };

      // Make the API request to download the PDF using axios
      const axiosResponse = await axios.post(ENDPOINTS.DOWNLOAD_INVOICE,
        { order_id: id },
        downloadConfig
      );

      // Write the blob data to file using ReactNativeBlobUtil
      // Convert blob to base64 for React Native file system
      const reader = new FileReader();
      const base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(axiosResponse.data);
      });

      await ReactNativeBlobUtil.fs.writeFile(filePath, base64Data, 'base64');

      // Create a response object similar to ReactNativeBlobUtil format
      const response = {
        path: () => filePath,
        respInfo: {
          status: axiosResponse.status,
          headers: axiosResponse.headers,
        }
      };

      // Validate the response before proceeding
      if (response.respInfo.status !== 200) {
        // Try to read the error response body for more details
        let errorDetails = '';
        try {
          const errorText = await ReactNativeBlobUtil.fs.readFile(response.path(), 'utf8');
          errorDetails = ` - ${errorText}`;
        } catch (readError) {
          console.log('Could not read error response:', readError);
        }
        throw new Error(`Download failed with status: ${response.respInfo.status}${errorDetails}`);
      }

      // Check if the response is actually a PDF
      const contentType = response.respInfo.headers['Content-Type'] || response.respInfo.headers['content-type'];
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error(`Invalid file type received: ${contentType}. Expected PDF.`);
      }

      // For Android, handle file saving and notifications
      if (Platform.OS === 'android') {
        try {
          let finalPath = response.path();

          // For Android 10+ use MediaCollection
          if (Platform.Version >= 29) {
            const mediaResult = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
              name: filename,
              parentFolder: 'Download',
              mimeType: 'application/pdf',
            }, 'Download', response.path());

            finalPath = mediaResult;

            // Clean up the temporary file
            await ReactNativeBlobUtil.fs.unlink(response.path());
          } else {
            // For older Android versions, copy to public Downloads folder
            const publicDownloadPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
            await ReactNativeBlobUtil.fs.cp(response.path(), publicDownloadPath);
            finalPath = publicDownloadPath;
          }

          // Add download notification for all Android versions
          try {
            await ReactNativeBlobUtil.android.addCompleteDownload({
              title: `Invoice ${id}`,
              description: 'Invoice downloaded successfully',
              mime: 'application/pdf',
              path: finalPath,
              showNotification: true
            });
          } catch (notificationError) {
            // Fallback: Use MediaScanner to make file visible
            try {
              await ReactNativeBlobUtil.android.scanFile([{
                path: finalPath,
                mime: 'application/pdf'
              }]);
            } catch (scanError) {
              console.log('Scan error:', scanError);
            }
          }

        } catch (moveError) {
          console.log('File move error (using original location):', moveError);
          // File is still available at original location - try to add notification anyway
          try {
            await ReactNativeBlobUtil.android.addCompleteDownload({
              title: `Invoice ${id}`,
              description: 'Invoice downloaded successfully',
              mime: 'application/pdf',
              path: response.path(),
              showNotification: true
            });
          } catch (fallbackNotificationError) {
            console.log('Fallback notification error:', fallbackNotificationError);
          }
        }
      }

      // use toast to show success message
      Toast.show({
        text1: 'Invoice downloaded successfully',
        type: 'success',
      });

      // For iOS, optionally preview the document
      if (Platform.OS === 'ios') {
        ReactNativeBlobUtil.ios.previewDocument(response.path());
      }

      return {
        success: true,
        filePath: response.path(),
        filename: filename,
        orderId: id
      };
    } catch (error) {
      console.log('PDF download error:', error);

      // Try to read the error response if it exists
      let errorMessage = 'There was an error downloading the invoice. Please try again.';
      if (error.message.includes('status:')) {
        errorMessage = `Server error: ${error.message}`;
      }

      Toast.show({
        text1: 'Download Failed',
        text2: errorMessage,
        type: 'error',
      });

      return rejectWithValue(error.response?.data?.message || error.message || 'Download failed');
    }
  }
);

const initialState = {
  initiatePayment: null,
  confirmPayment: null,
  initiateLoading: false,
  confirmLoading: false,
  initiateError: null,
  confirmError: null,
  planData: null,
  getPlansLoading: false,
  getPlansError: null,
  orderData: null,
  orderLoading: false,
  orderError: null,
  completedTripsData: null,
  getCompletedTripsLoading: false,
  getCompletedTripsError: null,
  paymentHistoryData: null,
  getPaymentHistoryLoading: false,
  getPaymentHistoryError: null,
  downloadInvoiceData: null,
  downloadInvoiceLoading: false,
  downloadInvoiceError: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  extraReducers: (builder) => {
    builder
      // Handle initiate payment
      .addCase(initiatePayment.pending, (state) => {
        state.initiateLoading = true;
        state.initiateError = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.initiatePayment = action.payload;
        state.initiateLoading = false;
        state.initiateError = null;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.initiateLoading = false;
        state.initiateError = action.payload;
      })
      // Handle confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.confirmLoading = true;
        state.confirmError = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.confirmPayment = action.payload;
        state.confirmLoading = false;
        state.confirmError = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.confirmLoading = false;
        state.confirmError = action.payload;
      })
      // Handle get plans
      .addCase(getPlans.pending, (state) => {
        state.getPlansLoading = true;
        state.getPlansError = null;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.planData = action.payload;
        state.getPlansLoading = false;
        state.getPlansError = null;
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.getPlansLoading = false;
        state.getPlansError = action.payload;
      })
      // Handle create order
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderData = action.payload;
        state.orderLoading = false;
        state.orderError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
      })
      // Handle get completed trips
      .addCase(getCompletedTrips.pending, (state) => {
        state.getCompletedTripsLoading = true;
        state.getCompletedTripsError = null;
      })
      .addCase(getCompletedTrips.fulfilled, (state, action) => {
        state.completedTripsData = action.payload;
        state.getCompletedTripsLoading = false;
        state.getCompletedTripsError = null;
      })
      .addCase(getCompletedTrips.rejected, (state, action) => {
        state.getCompletedTripsLoading = false;
        state.getCompletedTripsError = action.payload;
      })
      // Handle get payment history
      .addCase(getPaymentHistory.pending, (state) => {
        state.getPaymentHistoryLoading = true;
        state.getPaymentHistoryError = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistoryData = action.payload;
        state.getPaymentHistoryLoading = false;
        state.getPaymentHistoryError = null;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.getPaymentHistoryLoading = false;
        state.getPaymentHistoryError = action.payload;
      })
      // Handle download invoice
      .addCase(downloadInvoice.pending, (state) => {
        state.downloadInvoiceLoading = true;
        state.downloadInvoiceError = null;
      })
      .addCase(downloadInvoice.fulfilled, (state, action) => {
        state.downloadInvoiceData = action.payload;
        state.downloadInvoiceLoading = false;
        state.downloadInvoiceError = null;
      })
      .addCase(downloadInvoice.rejected, (state, action) => {
        state.downloadInvoiceLoading = false;
        state.downloadInvoiceError = action.payload;
      });
  }
});

export default paymentSlice.reducer; 