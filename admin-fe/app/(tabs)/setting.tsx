import { logoutAdmin } from "@/src/api/admin";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  GestureResponderEvent
} from "react-native";

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useColorScheme } from "nativewind";

// Helper function to darken color - necessary if custom hex colors are used
function darkenColor(hexColor: string) {
  let color = hexColor.replace("#", "");
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) - 40;
  let g = ((num >> 8) & 0x00ff) - 40;
  let b = (num & 0x0000ff) - 40;

  r = r < 0 ? 0 : r;
  g = g < 0 ? 0 : g;
  b = b < 0 ? 0 : b;

  return `rgb(${r},${g},${b})`;
}
function NavButton({
  title,
  onPress,
  icon,
  color = "rgba(85, 85, 85, 0.56)",
}: {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: keyof typeof FontAwesome.glyphMap;
  color?: string;
}) {
  const [pressed, setPressed] = useState(false);
  const { colorScheme } = useColorScheme();

  // Determine button background color dynamically
  const buttonBgColor = pressed ? darkenColor(color) : color;

  return (
    <Button
      variant="solid"
      action="primary"
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ backgroundColor: buttonBgColor }}
      className={`
        py-3 rounded-lg my-2 flex-row items-center justify-center w-full
        ${color === "#ef4444" ? "bg-red-600" : "bg-neutral-600"}
        ${colorScheme === "dark" ? "dark:bg-neutral-700" : ""}
      `}
    >
      {icon && (
        <FontAwesome
          name={icon}
          size={20}
          color="white"
          className="mr-2"
        />
      )}
      <ButtonText className="text-white text-base font-semibold">
        {title}
      </ButtonText>
    </Button>
  );
}

export default function SettingScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      console.log(result.message);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("username");
      router.replace("/login");
    } else {
      console.error(result.message);
    }
  };

  useEffect(() => {
    async function loadUsername() {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        setUsername(storedUsername);
      } catch (error) {
        console.error("Failed to load username", error);
      }
    }
    loadUsername();
  }, []);

  const mainTextColorClass = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const cardBgClass = colorScheme === "dark" ? "bg-neutral-800" : "bg-white";
  const cardBorderClass = colorScheme === "dark" ? "border-neutral-700" : "border-gray-200";

  return (
    <Box
      className={`
        flex-1 p-5 items-center justify-center // <-- Tambahkan justify-center di sini
        ${colorScheme === "dark" ? "bg-neutral-900" : "bg-gray-100"}
      `}
    >
      {/* Combined Card */}
      <Box
        className={`w-full max-w-sm p-5 rounded-lg shadow-md border ${cardBorderClass} ${cardBgClass}`}
      >
        {/* Profile Section (now inside the single card) */}
        <VStack className="items-center mb-5">
          <Image
            source={{
              uri: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
            }}
            className="w-20 h-20 rounded-full mb-3"
            alt="User Avatar"
          />
          <Text className={`text-xl font-bold ${mainTextColorClass}`}>
            {username ?? "User"}
          </Text>
        </VStack>

        {/* Account Settings Heading */}
        <Heading size="xl" className={`mb-5 text-center ${mainTextColorClass}`}>
          Account Settings
        </Heading>

        {/* Navigation Buttons */}
        <VStack className="w-full">
          {username === "owner" && (
            <NavButton
              title="Create Account Admin"
              onPress={() => router.push("/register")}
              icon="user-plus"
              color={colorScheme === "dark" ? "#2563eb" : "#3b82f6"}
            />
          )}
          <NavButton
            title="Activities"
            onPress={() => router.push("/admin_activity")}
            icon="file-text"
            color={colorScheme === "dark" ? "#4b5563" : "#6b7280"}
          />
          <NavButton
            title="Security"
            onPress={() => router.push("/security")}
            icon="lock"
            color={colorScheme === "dark" ? "#4b5563" : "#6b7280"}
          />
          <NavButton
            title="Logout"
            onPress={handleLogout}
            icon="sign-out"
            color="#ef4444"
          />
        </VStack>
      </Box>
    </Box>
  );
}