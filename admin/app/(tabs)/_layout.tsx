import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Dimensions } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { width } = Dimensions.get("window");

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'FontAwesome': require('@/assets/fonts/FontAwesome.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  
  const showTabBarLabel = width >= 900;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        headerStyle: {
          marginTop: 10,
          paddingHorizontal: 20,
          backgroundColor: "white",
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: showTabBarLabel ? "Home" : undefined,
          tabBarIcon: ({ color, size }) => (
            // Menggunakan ikon FontAwesome. Sesuaikan nama ikon dengan daftar FontAwesome.
            <FontAwesome name="home" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarLabel: showTabBarLabel ? "Transactions" : undefined,
          tabBarIcon: ({ color, size }) => (
            // Contoh ikon FontAwesome untuk transaksi: "file-text" atau "exchange"
            <FontAwesome name="truck" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          tabBarLabel: showTabBarLabel ? "Product Management" : undefined,
          tabBarIcon: ({ color, size }) => (
            // Contoh ikon FontAwesome untuk produk: "dropbox" atau "cube"
            <FontAwesome name="cube" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user_advertisement"
        options={{
          tabBarLabel: showTabBarLabel ? "User Advertisement" : undefined,
          tabBarIcon: ({ color, size }) => (
            // Contoh ikon FontAwesome untuk iklan: "bullhorn" atau "newspaper-o"
            <FontAwesome name="bullhorn" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: showTabBarLabel ? "Setting" : undefined,
          tabBarIcon: ({ color, size }) => (
            // Contoh ikon FontAwesome untuk pengaturan: "cog" atau "gear"
            <FontAwesome name="cog" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
