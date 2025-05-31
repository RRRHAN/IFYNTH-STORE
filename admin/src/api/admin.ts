import { BASE_URL } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Register } from "../types/setting";

export const loginAdmin = async (username: string, password: string) => {
  try {
    const loginUrl = `${BASE_URL}/api/user/login`;
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

      await AsyncStorage.setItem("auth_token", token);
      await AsyncStorage.setItem("expires_at", expires);
      await AsyncStorage.setItem("username", username);

      return { success: true, message: "Login Successfully!" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred. Please try again." };
  }
};

export const logoutAdmin = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      return { success: false, message: "No token found, already logged out." };
    }

    const response = await fetch(`${BASE_URL}/api/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok || data.success) {
      await AsyncStorage.clear();

      return { success: true, message: "Logout Successfully!" };
    } else {
      return {
        success: false,
        message:
          data.message || "An error occurred during logout. Please try again.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred during logout. Please try again.",
    };
  }
};

export const checkLoginStatus = async (
  router: ReturnType<typeof useRouter>
): Promise<boolean> => {
  const jwtToken = await AsyncStorage.getItem("auth_token");
  const isLoggedInLocally = await AsyncStorage.getItem("is_logged_in");

  if (isLoggedInLocally === "false" || !isLoggedInLocally || !jwtToken) {
    router.replace("/login");
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/user/check-jwt`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      console.log("JWT verified successfully with backend.");
      return true;
    } else {
      await AsyncStorage.setItem("is_logged_in", "false");
      await AsyncStorage.removeItem("auth_token");
      router.replace("/login");
      return false;
    }
  } catch (error) {
    await AsyncStorage.setItem("is_logged_in", "false");
    await AsyncStorage.removeItem("auth_token");
    router.replace("/login");
    return false;
  }
};

export const changePassword = async (
  current_password: string,
  new_password: string,
  confirmed_password: string
) => {
  const token = await AsyncStorage.getItem("auth_token");

  if (new_password !== confirmed_password) {
    return { success: false, message: "Passwords do not match." };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/user/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password,
        new_password,
        role: "ADMIN",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.errors?.[0] || "Failed to change password.",
      };
    }

    return { success: true, message: "Change Password Successfully!" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating password. Please try again.",
    };
  }
};

export const register = async (
  userData: Register
): Promise<{ success: boolean; message: string }> => {
  const token = await AsyncStorage.getItem("auth_token");
  if (userData.Password !== userData.ConfirmedPassword) {
    return { success: false, message: "Passwords do not match." };
  }
  try {
    const response = await fetch(`${BASE_URL}/api/user/registerAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: userData.Name,
        username: userData.Username,
        password: userData.Password,
        phoneNumber: userData.PhoneNumber,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Create Account successful",
      };
    } else {
      return {
        success: false,
        message: data.message || data.errors?.[0] || "Registration failed",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Network error. Please try again." };
  }
};
