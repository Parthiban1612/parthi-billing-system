import { getPlatformShadow } from '../utils/platformUtils';

// Custom box shadow utility function
export const createBoxShadow = (x = 0, y = 0, blur = 0, spread = 0, color = '#000', opacity = 0.1) => {
  return getPlatformShadow(x, y, blur, spread, color, opacity);
};``