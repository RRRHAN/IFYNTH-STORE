import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { changePassword } from "@/src/api/admin";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import ModalComponent from "@/components/ModalComponent";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function SecurityScreen() {
  const router = useRouter();
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

    // Tambahkan validasi sederhana untuk password baru
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
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
      <IconButton
        icon={({ color, size }) => (
          <FontAwesome name="arrow-left" size={size} color={color} />
        )}
        size={30}
        onPress={() => router.replace("/setting")}
        style={{
          top: 20,
        }}
      />
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

      <TouchableOpacity
        style={[
          styles.btn,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        onPress={handleChangePassword}
      >
        {/* Mengubah MaterialCommunityIcons menjadi FontAwesome */}
        <FontAwesome
          name="lock"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        {/* Menggunakan "lock" atau "key" */}
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
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
