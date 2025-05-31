import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = () => {
    if (!username || !fullName || !password || !phoneNumber) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    // Contoh validasi nomor telepon sederhana
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    // Simulasi sukses register (ganti dengan logic API kamu)
    Alert.alert("Success", "Registration successful!");

    // Reset form
    setUsername("");
    setFullName("");
    setPassword("");
    setPhoneNumber("");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Create Account</ThemedText>

      <ThemedText style={styles.label}>Username</ThemedText>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <ThemedText style={styles.label}>Full Name</ThemedText>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <ThemedText style={styles.label}>Password</ThemedText>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <ThemedText style={styles.label}>Phone Number</ThemedText>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { marginTop: 10, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  btn: {
    marginTop: 30,
    backgroundColor: "#005BBB",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 18 },
});
