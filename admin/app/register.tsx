import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import ModalComponent from "@/components/ModalComponent";
import { register } from "@/src/api/admin";
import { PaperProvider } from "react-native-paper";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    if (
      !username ||
      !fullName ||
      !password ||
      !phoneNumber ||
      !confirmPassword
    ) {
      setErrorMessage("Please fill all fields!");
      setSuccessMessage("");
      setVisible(true);
      return;
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage("Please enter a valid phone number");
      setSuccessMessage("");
      setVisible(true);
      return;
    }
    const result = await register({
      Username: username,
      Name: fullName,
      PhoneNumber: phoneNumber,
      Password: password,
      ConfirmedPassword: confirmPassword,
    });

    if (result.success) {
      setSuccessMessage(result.message);
      setErrorMessage("");
    } else {
      setSuccessMessage(result.message);
      setErrorMessage("");
    }

    // Reset form
    setUsername("");
    setFullName("");
    setPassword("");
    setconfirmPassword(""), setPhoneNumber("");
    setVisible(true);
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <ThemedView style={styles.container}>
              <ThemedText style={styles.title}>Create Account</ThemedText>

              <ThemedText style={styles.label}>Username</ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <ThemedText style={styles.label}>Full Name</ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />

              <ThemedText style={styles.label}>Password</ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setconfirmPassword}
                secureTextEntry
              />

              <ThemedText style={styles.label}>Phone Number</ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />

              <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                <Text style={styles.btnText}>Create Account</Text>
              </TouchableOpacity>
              <ModalComponent
                visible={visible}
                hideModal={() => setVisible(false)}
                message={errorMessage || successMessage}
              />
            </ThemedView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
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
