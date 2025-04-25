import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Icon } from "react-native-paper";
import { logoutAdmin } from "../api/admin";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      console.log(result.message);
      router.replace('/login');
      // Lakukan navigasi ke halaman login atau halaman lainnya
    } else {
      console.error(result.message);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
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
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon source="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Icon source="magnify" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Product Management",
          tabBarIcon: ({ color }) => (
            <Icon source="package-variant" size={28} color={color} />
          ),
        }}
      />
     <Tabs.Screen
        name="logout"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color }) => (
            <Icon source="exit-to-app" size={28} color={color} />
          ),
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              onPress={() => {
                handleLogout();
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
