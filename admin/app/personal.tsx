import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PersonalScreen() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSave = () => {
    if (!username || !fullName || !email || !phoneNumber) {
      Alert.alert("Error", "Mohon isi semua kolom.");
      return;
    }
    Alert.alert("Berhasil", "Data personal berhasil disimpan.");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Informasi Personal</ThemedText>

      <ThemedText style={styles.label}>Nama Pengguna</ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" // Username biasanya tidak kapital
      />

      <ThemedText style={styles.label}>Nama Lengkap</ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <ThemedText style={styles.label}>Email</ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <ThemedText style={styles.label}>Nomor Telepon</ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[
          styles.btn,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
        ]}
        onPress={handleSave}
      >
        <MaterialCommunityIcons name="content-save" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
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
    backgroundColor: '#005BBB',
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});