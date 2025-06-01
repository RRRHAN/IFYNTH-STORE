import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MyLightTheme, MyDarkTheme } from "@/constants/Theme";
import { checkLoginStatus } from "@/src/api/admin";
import * as Font from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    FontAwesome: require("@/assets/fonts/FontAwesome.ttf"),
  });

  useEffect(() => {
    const initApp = async () => {
      await Font.loadAsync({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        FontAwesome: require("@/assets/fonts/FontAwesome.ttf"),
      });

      if (loaded) {
        await SplashScreen.hideAsync();

        const isLoggedIn = await checkLoginStatus(router);
        if (!isLoggedIn) return;
      }
    };

    initApp();
  }, [loaded, router]);

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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="personal" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="security" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
