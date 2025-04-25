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
        Authorization: "Basic " + btoa("admin:admin"),
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

      return { success: true, message: "Login Successfully!" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred. Please try again." };
  }
};

export const logoutAdmin = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      return { success: false, message: 'No token found, already logged out.' };
    }

    // Mengirim permintaan logout ke backend
    const response = await fetch(`${BASE_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Sertakan token dalam header untuk validasi
      },
    });

    const data = await response.json();

    if (response.ok || data.success) {
      // Hapus token dan data lainnya setelah logout berhasil
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('expires_at');
      return { success: true, message: 'Logout Successfully!' };
    } else {
      return { success: false, message: data.message || 'An error occurred during logout. Please try again.' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred during logout. Please try again.' };
  }
};
