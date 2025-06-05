import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform, // Tetap gunakan jika perlu
  ScrollView, // Tetap gunakan
} from "react-native";

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

// Icons from Lucide (lebih modern dari FontAwesome di Gluestack)
import { ArrowLeft, UserPlus } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { useGlobalModal } from "@/context/ModalContext"; // Impor useGlobalModal
import { register } from "@/src/api/admin";

export default function RegisterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { showModal } = useGlobalModal(); // Dapatkan fungsi showModal

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = async () => {
    // Validasi input
    if (
      !username ||
      !fullName ||
      !password ||
      !phoneNumber ||
      !confirmPassword
    ) {
      showModal({
        title: "Pendaftaran Gagal!",
        message: "Mohon isi semua kolom!",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
      return;
    }

    if (password !== confirmPassword) {
      showModal({
        title: "Pendaftaran Gagal!",
        message: "Password tidak cocok!",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/; // Regex untuk nomor telepon (10-15 digit)
    if (!phoneRegex.test(phoneNumber)) {
      showModal({
        title: "Pendaftaran Gagal!",
        message: "Mohon masukkan nomor telepon yang valid (10-15 digit).",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
      return;
    }

    // Panggil API untuk register
    const result = await register({
      Username: username,
      Name: fullName,
      PhoneNumber: phoneNumber,
      Password: password,
      ConfirmedPassword: confirmPassword,
    });

    if (result.success) {
      showModal({
        title: "Pendaftaran Berhasil!",
        message: result.message || "Akun berhasil dibuat.",
        type: "success",
        autoClose: true,
        duration: 1500,
      });
      // Reset form
      setUsername("");
      setFullName("");
      setPassword("");
      setConfirmPassword("");
      setPhoneNumber("");
    } else {
      showModal({
        title: "Pendaftaran Gagal!",
        message: result.message || "Pendaftaran gagal karena kesalahan tidak dikenal.",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
    }
  };

  // Helper untuk kelas warna berdasarkan tema
  const textColorClass = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const labelColorClass = colorScheme === "dark" ? "text-gray-300" : "text-gray-700";
  const inputBorderClass = colorScheme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBgClass = colorScheme === "dark" ? "bg-neutral-800" : "bg-white";
  const mainBgClass = colorScheme === "dark" ? "bg-neutral-900" : "bg-gray-100";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {/* Menggunakan ScrollView langsung */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
        className={mainBgClass} // Apply background to ScrollView
      >
        {/* Tombol Kembali */}
        <Box
          className="w-full max-w-sm flex-row justify-start"
          style={{
            position: Platform.OS === "web" ? "relative" : "absolute",
            top: Platform.OS === "web" ? 0 : 40, // Sesuaikan top untuk status bar
            left: Platform.OS === "web" ? 0 : 20,
            zIndex: 10,
          }}
        >
          <Button
            variant="link"
            action="secondary"
            onPress={() => router.replace("/setting")}
            className="p-0"
          >
            <ButtonIcon
              as={ArrowLeft}
              size="lg"
              className={`${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            />
          </Button>
        </Box>

        {/* Konten Utama dalam Card */}
        <Box
          className={`w-full max-w-sm p-5 rounded-lg shadow-md border ${inputBorderClass} ${inputBgClass}`}
          style={{
            marginTop: Platform.OS === "web" ? 0 : 100,
          }}
        >
          <Heading size="xl" className={`mb-5 text-center ${textColorClass}`}>
            Create Account
          </Heading>

          <Text className={`mt-2 mb-1 ${labelColorClass}`}>Username</Text>
          <Input
            variant="outline"
            size="md"
            className={`w-full ${inputBorderClass} ${inputBgClass}`}
          >
            <InputField
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="Masukkan username"
              className={`${textColorClass}`}
            />
          </Input>

          <Text className={`mt-4 mb-1 ${labelColorClass}`}>Full Name</Text>
          <Input
            variant="outline"
            size="md"
            className={`w-full ${inputBorderClass} ${inputBgClass}`}
          >
            <InputField
              value={fullName}
              onChangeText={setFullName}
              placeholder="Masukkan nama lengkap"
              className={`${textColorClass}`}
            />
          </Input>

          <Text className={`mt-4 mb-1 ${labelColorClass}`}>Password</Text>
          <Input
            variant="outline"
            size="md"
            className={`w-full ${inputBorderClass} ${inputBgClass}`}
          >
            <InputField
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Masukkan password"
              className={`${textColorClass}`}
            />
          </Input>

          <Text className={`mt-4 mb-1 ${labelColorClass}`}>Confirm Password</Text>
          <Input
            variant="outline"
            size="md"
            className={`w-full ${inputBorderClass} ${inputBgClass}`}
          >
            <InputField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Konfirmasi password"
              className={`${textColorClass}`}
            />
          </Input>

          <Text className={`mt-4 mb-1 ${labelColorClass}`}>Phone Number</Text>
          <Input
            variant="outline"
            size="md"
            className={`w-full ${inputBorderClass} ${inputBgClass}`}
          >
            <InputField
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Masukkan nomor telepon"
              className={`${textColorClass}`}
            />
          </Input>

          <Button
            action="primary"
            onPress={handleRegister}
            className="mt-6 py-3 rounded-lg flex-row items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          >
            <ButtonIcon as={UserPlus} size="md" className="mr-2 text-white" />
            <ButtonText className="text-white text-base font-semibold">
              Create Account
            </ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}