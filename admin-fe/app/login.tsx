import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Checkbox, Provider as PaperProvider } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BASE_URL } from "./constants";
import ModalComponent from "../components/ModalComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const colorScheme = useColorScheme(); // Get the current color scheme
  const [visible, setVisible] = useState(false); // Untuk kontrol modal visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    try {
      const loginUrl = `${BASE_URL}/user/login`;
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:admin"), // Basic Auth header
        },
        body: JSON.stringify({
          username,
          password,
          role: "ADMIN",
        }),
      });

      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        setErrorMessage(data.errors[0]);
        setVisible(true);
      } else {
        setSuccessMessage("Login Successfully!");
        setVisible(true);
        
        // Save token and expiration date to AsyncStorage
        const { token, expires } = data.data;
        await AsyncStorage.setItem("auth_token", token); // Save token
        await AsyncStorage.setItem("expires_at", expires); // Save expiration date

        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Tambahkan delay untuk menunggu modal ditutup terlebih dahulu
      setTimeout(() => {
        router.replace("/home");
      }, 1000); // 1000 ms = 1 detik
    }
  }, [isLoggedIn]);

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg",
            }}
            style={styles.logo}
          />
          <Text
            style={[
              styles.logoText,
              { color: colorScheme === "dark" ? "#ffffff" : "#111827" },
            ]}
          >
            Flowbite
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colorScheme === "dark" ? "#333333" : "#ffffff" },
          ]}
        >
          <Text
            style={[
              styles.heading,
              { color: colorScheme === "dark" ? "#ffffff" : "#111827" },
            ]}
          >
            Sign in to your account
          </Text>

          <Text
            style={[
              styles.label,
              { color: colorScheme === "dark" ? "#ffffff" : "#111827" },
            ]}
          >
            Your username
          </Text>
          <TextInput
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

          <Text
            style={[
              styles.label,
              { color: colorScheme === "dark" ? "#ffffff" : "#111827" },
            ]}
          >
            Password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === "dark" ? "#555555" : "#f9fafb",
                color: colorScheme === "dark" ? "#ffffff" : "#111827",
              },
            ]}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.row}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => setRememberMe(!rememberMe)}
                color="#2563eb"
              />
              <Text
                style={[
                  styles.checkboxLabel,
                  { color: colorScheme === "dark" ? "#ffffff" : "#374151" },
                ]}
              >
                Remember me
              </Text>
            </View>
            <TouchableOpacity>
              <Text
                style={[
                  styles.link,
                  { color: colorScheme === "dark" ? "#3b82f6" : "#3b82f6" },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.signup,
              { color: colorScheme === "dark" ? "#d1d5db" : "#6b7280" },
            ]}
          >
            Don’t have an account yet?
            <Text style={styles.link}> Sign up</Text>
          </Text>
        </View>
        {/* Menambahkan Modal untuk menampilkan pesan */}
        <ModalComponent
          visible={visible}
          hideModal={() => setVisible(false)}
          message={errorMessage || successMessage} // Menampilkan error atau success message
        />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  card: {
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    elevation: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
  },
  link: {
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  signup: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
  },
});
