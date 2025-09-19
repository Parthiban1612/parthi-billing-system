import { Platform, StatusBar } from 'react-native';

/**
 * Get platform-specific status bar height
 * @returns {number} Status bar height
 */
export const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    // iOS has a fixed status bar height of 44 for non-notch devices
    // For notch devices, we'll use a safe default
    return 44;
  } else {
    // Android uses StatusBar.currentHeight
    return StatusBar.currentHeight || 0;
  }
};

/**
 * Get platform-specific safe area top padding
 * @param {boolean} includeStatusBar - Whether to include status bar height
 * @returns {number} Safe area top padding
 */
export const getSafeAreaTop = (includeStatusBar = true) => {
  if (Platform.OS === 'ios') {
    // iOS safe area top (status bar + notch area)
    return includeStatusBar ? 44 : 0;
  } else {
    // Android status bar height
    return includeStatusBar ? (StatusBar.currentHeight || 0) : 0;
  }
};

/**
 * Platform-specific keyboard avoiding behavior
 * @returns {string} 'padding' for iOS, 'height' for Android
 */
export const getKeyboardAvoidingBehavior = () => {
  return Platform.OS === 'ios' ? 'padding' : 'height';
};

/**
 * Platform-specific keyboard vertical offset
 * @param {number} customOffset - Custom offset value
 * @returns {number} Keyboard vertical offset
 */
export const getKeyboardVerticalOffset = (customOffset = 0) => {
  return Platform.OS === 'ios' ? customOffset : 0;
};

/**
 * Platform-specific shadow properties
 * @param {number} x - Shadow offset X
 * @param {number} y - Shadow offset Y
 * @param {number} blur - Shadow blur radius
 * @param {number} spread - Shadow spread radius
 * @param {string} color - Shadow color
 * @param {number} opacity - Shadow opacity
 * @returns {object} Platform-specific shadow styles
 */
export const getPlatformShadow = (x = 0, y = 0, blur = 0, spread = 0, color = '#000', opacity = 0.1) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: {
        width: x,
        height: y,
      },
      shadowOpacity: opacity,
      shadowRadius: blur / 2,
    };
  } else {
    // Android elevation
    return {
      elevation: Math.max(blur / 4, 1),
    };
  }
};

/**
 * Platform-specific font family fallbacks
 * @param {string} fontFamily - Primary font family
 * @returns {string} Platform-specific font family with fallbacks
 */
export const getPlatformFontFamily = (fontFamily) => {
  if (Platform.OS === 'ios') {
    return `${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
  } else {
    return `${fontFamily}, 'Roboto', 'Noto Sans', sans-serif`;
  }
};

/**
 * Platform-specific border radius for better visual consistency
 * @param {number} radius - Base border radius
 * @returns {number} Platform-adjusted border radius
 */
export const getPlatformBorderRadius = (radius) => {
  if (Platform.OS === 'ios') {
    // iOS tends to look better with slightly larger border radius
    return radius * 1.1;
  } else {
    return radius;
  }
}; 