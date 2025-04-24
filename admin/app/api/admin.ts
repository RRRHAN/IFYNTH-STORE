// src/services/authService.ts
import { BASE_URL } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginAdmin = async (username: string, password: string) => {
  try {
    const loginUrl = `${BASE_URL}/user/login`;
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("admin:admin"), // Basic Auth header
      },
      body: JSON.stringify({
        username,
        password,
        role: "ADMIN",
      }),
    });

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      return { success: false, message: data.errors[0] };
    } else {
      const { token, expires } = data.data;
      // Save token and expiration date to AsyncStorage
      await AsyncStorage.setItem("auth_token", token);
      await AsyncStorage.setItem("expires_at", expires);
      await AsyncStorage.setItem("setIsloggedIn", "true");

      return { success: true, message: "Login Successfully!" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred. Please try again." };
  }
};
