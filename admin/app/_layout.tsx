import {
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MyLightTheme, MyDarkTheme } from "@/constants/Theme";
import { BASE_URL } from "@/src/api/constants";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
        const jwtToken = await AsyncStorage.getItem("auth_token");

        const isLoggedInLocally = await AsyncStorage.getItem("is_logged_in");
        if (isLoggedInLocally === 'false' || !isLoggedInLocally || !jwtToken) {
          router.replace("/login");
          return;
        }

        try {
          const response = await fetch(`${BASE_URL}/api/user/check-jwt`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            console.log("JWT verified successfully with backend.");
          } else {
            await AsyncStorage.setItem("is_logged_in", "false");
            await AsyncStorage.removeItem("auth_token");
            router.replace("/login");
          }
        } catch (error) {
          await AsyncStorage.setItem("is_logged_in", "false");
          await AsyncStorage.removeItem("auth_token");
          router.replace("/login");
        }
      }
    };

    checkLoginStatus();
  }, [loaded, router]);
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="add_product" options={{ headerShown: false }} />
        <Stack.Screen name="detail_product" options={{ headerShown: false }} />
        <Stack.Screen name="edit_product" options={{ headerShown: false }} />
        <Stack.Screen name="message" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}