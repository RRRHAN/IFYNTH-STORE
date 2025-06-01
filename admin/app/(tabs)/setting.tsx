import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { logoutAdmin } from "@/src/api/admin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';

function NavButton({
  title,
  onPress,
  icon,
  color = "rgba(85, 85, 85, 0.56)",
}: {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: keyof typeof FontAwesome.glyphMap; // Mengubah tipe icon menjadi FontAwesome.glyphMap
  color?: string;
}) {
  const [pressed, setPressed] = useState(false);

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

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.btn,
        { backgroundColor: pressed ? darkenColor(color) : color },
      ]}
    >
      {/* Render ikon jika prop icon diberikan */}
      {icon && (
        <FontAwesome // Mengubah komponen ikon menjadi FontAwesome
          name={icon}
          size={20}
          color="white"
          style={styles.btnIcon}
        />
      )}
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function SettingScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      console.log(result.message);
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

  return (
    <ThemedView style={styles.container}>
      {/* Avatar dan Username */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" }}
          style={styles.avatar}
        />
        <ThemedText style={styles.username}>{username ?? "User"}</ThemedText>
      </View>

      <ThemedText style={styles.title}>Account Settings</ThemedText>

      {username === "owner" && (
        <NavButton
          title="Create Account Admin"
          onPress={() => router.push("/register")}
          icon="user-plus"
        />
      )}

      <NavButton
        title="Personal"
        onPress={() => router.push("/personal")}
        icon="user"
      />
      <NavButton
        title="Security"
        onPress={() => router.push("/security")}
        icon="lock"
      />
      <NavButton
        title="Logout"
        onPress={handleLogout}
        icon="sign-out"
        color="#e53935"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  btn: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});