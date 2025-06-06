import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GlobalModalProvider } from "../context/ModalContext";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
      <GlobalModalProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="transaction-detail" options={{ headerShown: false }}/>
          <Stack.Screen name="add_product" options={{ headerShown: false }}/>
          <Stack.Screen name="security" options={{ headerShown: false }}/>
          <Stack.Screen name="register" options={{ headerShown: false }}/>
          <Stack.Screen name="personal" options={{ headerShown: false }}/>
          <Stack.Screen name="admin_activity" options={{ headerShown: false }}/>
          <Stack.Screen name="edit_product" options={{ headerShown: false }}/>
          <Stack.Screen name="message" options={{ headerShown: false }}/>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </GlobalModalProvider>
    </GluestackUIProvider>
  );
}
