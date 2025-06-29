// src/constants.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const BASE_URL = (() => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:7777";
  } else if (Platform.OS === "ios") {
    return "http://192.168.1.3:7777";
  } else {
    return "http://localhost:7777";
  }
})();

export const BASE_URLS = (() => {
  return "https://ifynth.raihan-firm.com";
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
