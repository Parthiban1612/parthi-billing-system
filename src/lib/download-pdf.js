import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

/// grant permission in android
export const getDownloadPermissionAndroid = async () => {
  console.log('getDownloadPermissionAndroid');

  // For Android API 30+ (Android 11+), WRITE_EXTERNAL_STORAGE is not needed for Downloads folder
  if (Platform.Version >= 30) {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save Files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to download files. Please enable it in app settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
  } catch (err) {
    console.log('Permission request error:', err);
    return false;
  }
};

export const downloadFile = async url => {
  // Check and request permission for Android
  if (Platform.OS === 'android') {
    const hasPermission = await getDownloadPermissionAndroid();
    if (!hasPermission) {
      console.log('Download permission denied');
      return null;
    }
  }

  // Get the app's download directory
  const { config, fs } = ReactNativeBlobUtil;
  const downloadDir = Platform.select({
    ios: fs.dirs.DocumentDir,
    android: fs.dirs.DownloadDir,
  });

  // Generate a unique filename for the downloaded file
  const filename = url.split('/').pop() || `download_${Date.now()}`;
  const filePath = `${downloadDir}/${filename}`;

  try {
    // Configure download options
    const configOptions = {
      fileCache: true,
      path: filePath,
      appendExt: filename.split('.').pop() || 'pdf',
      ...Platform.select({
        ios: {
          // iOS specific options
        },
        android: {
          // Android specific options - use MediaStore for Android 10+
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mime: 'application/pdf',
            description: 'Downloading file...',
            path: filePath,
            mediaScannable: true,
          },
        },
      }),
    };

    console.log('Starting download:', url);
    const response = await ReactNativeBlobUtil.config(configOptions).fetch('GET', url);

    console.log('Download completed:', response.path());

    // Show success message
    Alert.alert(
      'Download Complete',
      `File downloaded successfully to ${Platform.OS === 'android' ? 'Downloads folder' : 'Documents folder'}`,
      [{ text: 'OK' }]
    );

    // Return the response for further processing
    return response;
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert(
      'Download Failed',
      'There was an error downloading the file. Please try again.',
      [{ text: 'OK' }]
    );
    return null;
  }
};

// Alternative download method using MediaStore for Android 10+
export const downloadFileToMediaStore = async (url, filename) => {
  if (Platform.OS !== 'android') {
    return downloadFile(url);
  }

  try {
    const { config, fs, MediaCollection } = ReactNativeBlobUtil;

    // Use MediaCollection for Android 10+
    const response = await config({
      fileCache: true,
    }).fetch('GET', url);

    // Save to MediaStore (Downloads collection)
    await MediaCollection.copyToMediaStore({
      name: filename || `download_${Date.now()}.pdf`,
      parentFolder: 'Download',
      mimeType: 'application/pdf',
    }, 'Download', response.path());

    // Clean up temporary file
    await fs.unlink(response.path());

    Alert.alert(
      'Download Complete',
      'File saved to Downloads folder',
      [{ text: 'OK' }]
    );

    return true;
  } catch (error) {
    console.error('MediaStore download error:', error);
    // Fallback to regular download
    return downloadFile(url);
  }
};