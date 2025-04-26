// src/hooks/useAuthToken.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthToken = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (token) {
          setAuthToken(token);
        }
      } catch (error) {
        console.error("Failed to fetch auth token:", error);
      }
    };

    fetchAuthToken();
  }, []);

  return authToken;
};
