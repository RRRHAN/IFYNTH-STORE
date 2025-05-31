import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Dimensions } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { width } = Dimensions.get("window");

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...MaterialCommunityIcons.font,
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogout = async () => {
    // ...kode logout
  };

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
            <MaterialCommunityIcons name="home" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarLabel: showTabBarLabel ? "Transactions" : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          tabBarLabel: showTabBarLabel ? "Product Management" : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user_advertisement"
        options={{
          tabBarLabel: showTabBarLabel ? "User Advertisement" : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bullhorn" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: showTabBarLabel ? "Setting" : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-cog-outline" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
