// src/constants.js
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = (() => {
  return 'http://185.201.8.140';
})();

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    throw new Error("Failed to fetch auth token.");
  }
};