import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function PersonalScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSave = () => {
    if (!fullName || !email || !phoneNumber) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    // Simpan data ke backend atau AsyncStorage sesuai kebutuhan
    Alert.alert("Success", "Personal data saved");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Personal Information</ThemedText>

      <ThemedText style={styles.label}>Username</ThemedText>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <ThemedText style={styles.label}>Full Name</ThemedText>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <ThemedText style={styles.label}>Phone Number</ThemedText>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.btn}>
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
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
