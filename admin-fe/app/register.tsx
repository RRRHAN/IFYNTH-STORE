import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputSlot } from "@/components/ui/input"; // Import InputSlot
import { Text } from "@/components/ui/text";
import { ArrowLeft, UserPlus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useGlobalModal } from "@/context/ModalContext";
import { register } from "@/src/api/admin";

export default function RegisterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { showModal } = useGlobalModal();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Inisialisasi phoneNumber dengan hanya bagian angkanya saja, +62 akan di InputSlot
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = async () => {
    // Validasi sekarang menggunakan phoneNumber UTUH (termasuk +62)
    // Jadi kita perlu membandingkan phoneNumber.length dengan minimal yang diharapkan (misal, 3 untuk "+62" + 9 digit)
    if (
      !username ||
      !fullName ||
      !password ||
      !confirmPassword ||
      phoneNumber.length < 9 // Minimal 9 digit setelah +62
    ) {
      showModal({
        title: "Pendaftaran Gagal!",
        message: "Mohon isi semua kolom dan nomor telepon harus valid!",
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

    // Validasi regex hanya untuk bagian angka setelah +62
    const phoneNumDigits = phoneNumber; // phoneNumber sekarang hanya berisi angka setelah +62
    const phoneRegex = /^[1-9][0-9]{8,12}$/; // Angka pertama tidak boleh 0, total 9-13 digit
    if (!phoneRegex.test(phoneNumDigits)) {
      showModal({
        title: "Error!",
        message:
          "Nomor telepon tidak valid. Angka pertama tidak boleh 0 dan harus 9-13 digit.",
        type: "error",
        autoClose: true,
        duration: 2000,
      });
      return;
    }

    // Nomor telepon yang dikirim ke API adalah +62 digabung dengan phoneNumber dari state
    const fullPhoneNumber = "+62" + phoneNumber;

    // Panggil API untuk register
    const result = await register({
      Username: username,
      Name: fullName,
      PhoneNumber: fullPhoneNumber, // Kirim nomor lengkap ke API
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
      setPhoneNumber(""); // Reset hanya bagian angka
    } else {
      showModal({
        title: "Pendaftaran Gagal!",
        message:
          result.message || "Pendaftaran gagal karena kesalahan tidak dikenal.",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
    }
  };

  // Handler khusus untuk phoneNumber (sekarang hanya memproses angka setelah +62)
  const handlePhoneNumberChange = (text: string) => {
    // Hapus semua karakter non-digit kecuali digit pertama jika itu bukan 0
    let cleanText = text.replace(/[^0-9]/g, '');

    // Pastikan angka pertama setelah +62 bukan 0 (jika pengguna mengetik 0 duluan)
    if (cleanText.length > 0 && cleanText[0] === '0') {
      cleanText = cleanText.substring(1); // Hapus angka 0 pertama
    }

    // Batasi panjang total digit (misal 13 digit setelah +62)
    if (cleanText.length > 13) {
      cleanText = cleanText.substring(0, 13);
    }

    setPhoneNumber(cleanText);
  };

  const textColorClass =
    colorScheme === "dark" ? "text-white" : "text-gray-900";
  const labelColorClass =
    colorScheme === "dark" ? "text-gray-300" : "text-gray-700";
  const inputBorderClass =
    colorScheme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBgClass = colorScheme === "dark" ? "bg-neutral-800" : "bg-white";
  const mainBgClass = colorScheme === "dark" ? "bg-neutral-900" : "bg-gray-100";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        className={mainBgClass}
      >
        <Box
          className="w-full max-w-sm flex-row justify-start"
          style={{
            position: Platform.OS === "web" ? "relative" : "absolute",
            top: Platform.OS === "web" ? 0 : 40,
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
              className={`${
                colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            />
          </Button>
        </Box>

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
              placeholder="Enter username"
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
              placeholder="Enter fullname"
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
              placeholder="Enter password"
              className={`${textColorClass}`}
            />
          </Input>

          <Text className={`mt-4 mb-1 ${labelColorClass}`}>
            Confirm Password
          </Text>
          <Input
            variant="outline"
            size="md"
            className={`w-full ${inputBorderClass} ${inputBgClass}`}
          >
            <InputField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Enter confirm Password"
              className={`${textColorClass}`}
            />
          </Input>

          <Text className={`mt-4 mb-1 ${labelColorClass}`}>Phone Number</Text>
          <Input
            variant="outline"
            size="md"
            className={`w-full ${inputBorderClass} ${inputBgClass}`}
          >
            <InputSlot
              className="px-2"
            >
              <Text className={`${textColorClass}`}>+62</Text>
            </InputSlot>
            <InputField
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              className={`${textColorClass}`}
              maxLength={13}
            />
          </Input>
          <Button
            action="primary"
            onPress={handleRegister}
            className="mt-6 py-2 rounded-lg flex-row items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
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