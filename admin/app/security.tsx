import React, { useState } from "react";
import {
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { changePassword } from "@/src/api/admin";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import ModalComponent from "@/components/ModalComponent";

export default function SecurityScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all password fields");
      return;
    }

    const result = await changePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (result.success) {
      setSuccessMessage(result.message);
      setErrorMessage("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setErrorMessage(result.message);
      setSuccessMessage("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setVisible(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Security Settings</ThemedText>

      <ThemedText style={styles.label}>Current Password</ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <ThemedText style={styles.label}>New Password</ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <ThemedText style={styles.label}>Confirm New Password</ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
        <Text style={styles.btnText}>Change Password</Text>
      </TouchableOpacity>
      <ModalComponent
        visible={visible}
        hideModal={() => setVisible(false)}
        message={errorMessage || successMessage}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#005BBB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
