import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native"; // Hanya Platform yang diperlukan

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

// Icons from Lucide (lebih modern dan sering digunakan bersama Gluestack)
import { ArrowLeft, Save } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { useGlobalModal } from "@/context/ModalContext"; // Impor useGlobalModal

export default function PersonalScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { showModal } = useGlobalModal(); // Dapatkan fungsi showModal

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSave = () => {
    if (!username || !fullName || !email || !phoneNumber) {
      showModal({
        title: "Error!",
        message: "Mohon isi semua kolom.",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
      return;
    }
    showModal({
      title: "Berhasil!",
      message: "Data personal berhasil disimpan.",
      type: "success",
      autoClose: true,
      duration: 1500,
    });
  };

  // Helper untuk kelas warna berdasarkan tema
  const textColorClass = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const labelColorClass = colorScheme === "dark" ? "text-gray-300" : "text-gray-700";
  const inputBorderClass = colorScheme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBgClass = colorScheme === "dark" ? "bg-neutral-800" : "bg-white";
  const mainBgClass = colorScheme === "dark" ? "bg-neutral-900" : "bg-gray-100";

  return (
    <Box className={`flex-1 p-5 items-center ${mainBgClass}`}>
      {/* Tombol Kembali */}
      <Box
        className="w-full max-w-sm flex-row justify-start"
        style={{
          position: Platform.OS === "web" ? "relative" : "absolute",
          top: Platform.OS === "web" ? 0 : 40, // Adjust as needed for safe area
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
          marginTop: Platform.OS === "web" ? 0 : 100, // Adjust as needed
        }}
      >
        <Heading size="xl" className={`mb-5 text-center ${textColorClass}`}>
          Informasi Personal
        </Heading>

        <Text className={`mt-2 mb-1 ${labelColorClass}`}>Nama Pengguna</Text>
        <Input
          variant="outline"
          size="md"
          className={`w-full ${inputBorderClass} ${inputBgClass}`}
        >
          <InputField
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="Masukkan nama pengguna"
            className={`${textColorClass}`}
          />
        </Input>

        <Text className={`mt-4 mb-1 ${labelColorClass}`}>Nama Lengkap</Text>
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

        <Text className={`mt-4 mb-1 ${labelColorClass}`}>Email</Text>
        <Input
          variant="outline"
          size="md"
          className={`w-full ${inputBorderClass} ${inputBgClass}`}
        >
          <InputField
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Masukkan alamat email"
            className={`${textColorClass}`}
          />
        </Input>

        <Text className={`mt-4 mb-1 ${labelColorClass}`}>Nomor Telepon</Text>
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
          onPress={handleSave}
          className="mt-6 py-3 rounded-lg flex-row items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        >
          <ButtonIcon as={Save} size="md" className="mr-2 text-white" />
          <ButtonText className="text-white text-base font-semibold">
            Save
          </ButtonText>
        </Button>
      </Box>
    </Box>
  );
}