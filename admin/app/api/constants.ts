// src/constants.js
import { Platform } from 'react-native';

export const BASE_URL = (() => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:7777';
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:7777';
    } else if (Platform.OS === 'web') {
      return 'http://localhost:7777';
    }
  }
  return 'https://api.yourdomain.com';
})();
