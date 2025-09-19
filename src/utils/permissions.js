import { Platform, Alert, Linking } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

// Try to import react-native-permissions, but provide fallback if not available
let PERMISSIONS, RESULTS, check, request;
try {
  const PermissionsModule = require('react-native-permissions');
  PERMISSIONS = PermissionsModule.PERMISSIONS;
  RESULTS = PermissionsModule.RESULTS;
  check = PermissionsModule.check;
  request = PermissionsModule.request;
} catch (error) {
  console.warn('react-native-permissions not available, using fallback methods');
}

// Permission types for different platforms
const PERMISSION_TYPES = {
  ios: {
    photo: 'ios.permission.PHOTO_LIBRARY',
    camera: 'ios.permission.CAMERA',
  },
  android: {
    photo: Platform.Version >= 33 ? 'android.permission.READ_MEDIA_IMAGES' : 'android.permission.READ_EXTERNAL_STORAGE',
    camera: 'android.permission.CAMERA',
  },
};

/**
 * Check and request photo library permissions
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const checkPhotoPermission = async () => {
  try {
    // If react-native-permissions is available, use it
    if (check && PERMISSIONS) {
      const permissionType = PERMISSION_TYPES[Platform.OS].photo;

      // Check current permission status
      const result = await check(permissionType);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('Permission not available on this device');
          return false;

        case RESULTS.DENIED:
          // Request permission
          const requestResult = await request(permissionType);
          return requestResult === RESULTS.GRANTED;

        case RESULTS.LIMITED:
          // Limited access granted (iOS 14+)
          return true;

        case RESULTS.GRANTED:
          return true;

        case RESULTS.BLOCKED:
          // Permission blocked, show settings dialog
          showPermissionSettingsDialog('Photo Library');
          return false;

        default:
          return false;
      }
    } else {
      // Fallback: use ImagePicker's built-in permission handling
      if (Platform.OS === 'ios') {
        try {
          const { status } = await ImagePicker.requestPermissions('photo');
          return status === 'authorized';
        } catch (error) {
          console.warn('ImagePicker permission request failed:', error);
          return false;
        }
      } else {
        // For Android, assume permission is granted (handled by system)
        return true;
      }
    }
  } catch (error) {
    console.error('Error checking photo permission:', error);
    return false;
  }
};

/**
 * Check and request camera permissions
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const checkCameraPermission = async () => {
  try {
    // If react-native-permissions is available, use it
    if (check && PERMISSIONS) {
      const permissionType = PERMISSION_TYPES[Platform.OS].camera;

      // Check current permission status
      const result = await check(permissionType);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('Camera permission not available on this device');
          return false;

        case RESULTS.DENIED:
          // Request permission
          const requestResult = await request(permissionType);
          return requestResult === RESULTS.GRANTED;

        case RESULTS.GRANTED:
          return true;

        case RESULTS.BLOCKED:
          // Permission blocked, show settings dialog
          showPermissionSettingsDialog('Camera');
          return false;

        default:
          return false;
      }
    } else {
      // Fallback: assume camera permission is granted (handled by system)
      return true;
    }
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

/**
 * Show dialog to open app settings
 * @param {string} permissionName - Name of the permission
 */
const showPermissionSettingsDialog = (permissionName) => {
  Alert.alert(
    `${permissionName} Permission Required`,
    `This app needs access to your ${permissionName.toLowerCase()} to function properly. Please enable it in your device settings.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        }
      }
    ]
  );
};

/**
 * Check all required permissions for image picker
 * @returns {Promise<boolean>} - Whether all permissions were granted
 */
export const checkImagePickerPermissions = async () => {
  try {
    // For iOS, we need photo library permission
    if (Platform.OS === 'ios') {
      return await checkPhotoPermission();
    }

    // For Android, we need both photo and camera permissions
    if (Platform.OS === 'android') {
      const photoPermission = await checkPhotoPermission();
      const cameraPermission = await checkCameraPermission();
      return photoPermission && cameraPermission;
    }

    return false;
  } catch (error) {
    console.error('Error checking image picker permissions:', error);
    return false;
  }
};

/**
 * Legacy permission check using ImagePicker (fallback)
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const checkImagePickerPermissionsLegacy = async () => {
  try {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestPermissions('photo');
      return status === 'authorized';
    }
    return true; // Android handles permissions differently
  } catch (error) {
    console.error('Error checking legacy permissions:', error);
    return false;
  }
};

/**
 * Get platform-specific error messages
 * @param {string} errorCode - Error code from ImagePicker
 * @returns {string} - User-friendly error message
 */
export const getImagePickerErrorMessage = (errorCode) => {
  const errorMessages = {
    'E_PICKER_CANCELLED': 'Image selection was cancelled.',
    'E_NO_IMAGE_DATA_FOUND': 'No image data found. Please try selecting a different image.',
    'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR': 'Camera cannot run on simulator. Please use a real device.',
    'E_PICKER_NO_DATA': 'No image data available. Please try again.',
    'E_PICKER_NO_CAMERA_PERMISSION': 'Camera permission is required. Please grant camera access.',
    'E_PICKER_NO_PHOTO_LIBRARY_PERMISSION': 'Photo library permission is required. Please grant photo access.',
    'E_PICKER_UNAUTHORIZED': 'Permission denied. Please grant access in settings.',
    'E_PICKER_CANNOT_SAVE': 'Cannot save image. Please check storage permissions.',
    'E_PICKER_CANNOT_READ_FILE': 'Cannot read selected file. Please try a different image.',
    'E_PICKER_CANNOT_CROP': 'Cannot crop image. Please try again.',
    'E_PICKER_CANNOT_COMPRESS': 'Cannot compress image. Please try again.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

export default {
  checkPhotoPermission,
  checkCameraPermission,
  checkImagePickerPermissions,
  checkImagePickerPermissionsLegacy,
  getImagePickerErrorMessage,
}; 