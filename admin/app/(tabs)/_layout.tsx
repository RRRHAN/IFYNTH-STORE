import { Tabs } from "expo-router";
import React from "react";
import { Platform, Dimensions } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Icon } from "react-native-paper";
import { logoutAdmin } from "@/src/api/admin";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { width } = Dimensions.get('window');

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      console.log(result.message);
      router.replace('/login');
    } else {
      console.error(result.message);
    }
  };

  // Tentukan apakah label tab harus ditampilkan berdasarkan lebar layar
  // Properti `title` biasanya untuk header, `tabBarLabel` untuk label di bawah ikon.
  const showTabBarLabel = width >= 1000;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false, // Ini menyembunyikan header layar
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
          // Menggunakan tabBarLabel untuk label di bawah ikon
          tabBarLabel: showTabBarLabel ? "Home" : undefined,
          tabBarIcon: ({ color }) => (
            <Icon source="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarLabel: showTabBarLabel ? "Transactions" : undefined,
          tabBarIcon: ({ color }) => (
            <Icon source="file-document" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          tabBarLabel: showTabBarLabel ? "Product Management" : undefined,
          tabBarIcon: ({ color }) => (
            <Icon source="package-variant" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user_advertisement"
        options={{
          tabBarLabel: showTabBarLabel ? "User Advertisement" : undefined,
          tabBarIcon: ({ color }) => (
            <Icon source="bullhorn" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          tabBarLabel: showTabBarLabel ? 'Logout' : undefined,
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