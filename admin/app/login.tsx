import { TouchableOpacity, Image, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Checkbox, Provider as PaperProvider } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { loginAdmin } from "@/src/api/admin";
import ModalComponent from "@/components/ModalComponent";
import styles from "./styles/loginStyles";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const colorScheme = useColorScheme();
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    const result = await loginAdmin(username, password);

    if (result.success) {
      setSuccessMessage(result.message);
      if (rememberMe) {
        await AsyncStorage.setItem("is_logged_in", "true");
      } else {
        await AsyncStorage.setItem("is_logged_in", "false");
      }
      setVisible(true);
      setIsLoggedIn(true);
    } else {
      setErrorMessage(result.message);
      setVisible(true);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home");
      setTimeout(() => {}, 2000);
    }
  }, [isLoggedIn]);

  return (
    <PaperProvider>
      <View style={[styles.container]}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(85, 85, 85, 0.56)"
                  : "rgba(187, 187, 187, 0.61)",
            },
          ]}
        >
          <ThemedText style={[styles.heading]}>
            Sign in to your account
          </ThemedText>

          <ThemedText style={[styles.label]}>Your username</ThemedText>
          <ThemedTextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === "dark" ? "#555555" : "#f9fafb",
                color: colorScheme === "dark" ? "#ffffff" : "#111827",
              },
            ]}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <ThemedText style={[styles.label]}>Password</ThemedText>
          <ThemedTextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === "dark" ? "#555555" : "#f9fafb",
                color: colorScheme === "dark" ? "#ffffff" : "#111827",
              },
            ]}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <ThemedView
            style={[
              styles.row,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(42, 42, 42, 0)"
                    : "rgba(207, 207, 207, 0)",
              },
            ]}
          >
            <ThemedView
              style={[
                styles.checkboxContainer,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(42, 42, 42, 0)"
                      : "rgba(207, 207, 207, 0)",
                },
              ]}
            >
              <Checkbox
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => setRememberMe(!rememberMe)}
                color="#2563eb"
              />
              <ThemedText
                style={[
                  styles.checkboxLabel,
                  { color: colorScheme === "dark" ? "#ffffff" : "#374151" },
                ]}
              >
                Remember me
              </ThemedText>
            </ThemedView>
            <TouchableOpacity
              style={[
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(42, 42, 42, 0)"
                      : "rgba(207, 207, 207, 0)",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.link,
                  { color: colorScheme === "dark" ? "#3b82f6" : "#3b82f6" },
                ]}
              >
                Forgot password?
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <ThemedText style={styles.buttonText}>Sign in</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ModalComponent
          visible={visible}
          hideModal={() => setVisible(false)}
          message={errorMessage || successMessage}
        />
      </View>
    </PaperProvider>
  );
}
