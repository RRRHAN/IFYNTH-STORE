import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Icon } from "react-native-paper";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
            <Icon source="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Icon source="compass" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Management Products",
          tabBarIcon: ({ color }) => (
            <Icon source="package-variant" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
