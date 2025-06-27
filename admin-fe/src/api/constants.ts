// src/constants.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = (() => {
  return 'https://ifynth.raihan-firm.com';
})();

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    console.error("Failed to fetch auth token:", error);
    return null;
  }
};